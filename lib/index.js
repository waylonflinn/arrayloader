var loader = require('./fs-loader'),
	autotype = require('./autotype'),
	asyncMap = require('async/map');

module.exports = {
	"load" : autoload,
	"type" : atype,
	"typeall" : typeall,
	"loadall" : autoloadall
};

function autoload(){
	// TODO: check for filesystem or network
	var url, type, compression, shape, callback;

	url = arguments[0];
	if(arguments.length === 2){
		callback = arguments[1];

	} else if(arguments.length === 3){
		type = arguments[1];
		callback = arguments[2];
	} else if(arguments.length === 4){
		type = arguments[1];
		compression = arguments[2];
		callback = arguments[3];
	} else if(arguments.length === 5){
		type = arguments[1];
		compression = arguments[2];
		shape = arguments[3];
		callback = arguments[4];
	}

	if(type == null){
		atype(url, function(err, type, compression, shape){
			if(err) return callback(err);
			return load(url, type, compression, shape, callback);
		});
	} else if(compression !== null && typeof(compression) !== "undefined") {
		let is_compression_type = (compression == loader.COMPRESSION_TYPE && type in loader.TYPE_MAP);
		
		if(!is_compression_type)
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));
		
		return loader.load(url, type, compression, shape, callback);

	} else {
		if(!(type in loader.TYPE_MAP))
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));

		return load(url, type, compression, shape, callback);
	}

}

function typeall(files, callback){
	asyncMap(files, atype, callback);
}

// take a tuple, upack it and call the loader
function loadhelper(tuple, callback){
	return autoload(tuple[0], tuple[1], callback);
}

/* load list of files */
function autoloadall(){
	var files, types, callback;

	if(arguments.length === 2){
		files = arguments[0];
		callback = arguments[1];
		types = files.map(function(file){ return null;});
	} else if(arguments.length === 3) {
		files = arguments[0];
		types = arguments[1];
		callback = arguments[2];
	}

	if(files.length !== types.length) return callback(new Error("Arrays of files and types must be same length."));

	var tuples = Array(files.length);
	for(var i = 0; i < tuples.length; i++){
		tuples[i] = [files[i], types[i]];
	}

	asyncMap(tuples, loadhelper, callback);
}


var http = require('http');
var url = require('url');

function atype(url, callback){

	var type = null;

	// check extension
	// infer type from extension, if possible
	var type, compressed, shape;
	[type, compressed, shape] = autotype.parse_extension(url);

	if(type != null){
		return callback(null, type, compressed, shape);
	} else if(url.startsWith("http://") || url.startsWith("https://")){
		// make a HEAD request to get type
		preflight(url, function(err, headers){

			if(err) return callback(err);

			var content_type = headers['content-type'];

			var mime_type = autotype.getMime(content_type);

			if(mime_type && mime_type in autotype.MIME_MAP){
				type = autotype.MIME_MAP[mime_type];
			}

			return callback(null, type); // may be null, if not found
		});
	} else {
		return callback();
	}

}

function load(path, type, compression, shape, callback){
	// network?
	if(path.startsWith("http://") || path.startsWith("https://")){
		return http_load(path, type, callback);
	} else {
		return loader.load(path, type, compression, shape, callback);
	}
}

function preflight(URL, callback){

	var parsed = url.parse(URL);

	var options = {
		"method" : "HEAD",
		"protocol" : parsed.protocol,
		"hostname" : parsed.hostname,
		"port" : parsed.port,
		"path" : parsed.path
	};

	var req = http.request(options, function(res){
		if(res.statusCode !== 200) return callback(new Error("failed to request file '" + URL +"'. " + res.statusCode));

		callback(null, res.headers);
	});

	req.end();
}

function http_load(URL, type, callback){
	type = type || "uint8";
	var is_text = (type == "str" || type == "json");
	var parsed = url.parse(URL);

	var options = {
		"method" : "GET",
		"protocol" : parsed.protocol,
		"hostname" : parsed.hostname,
		"port" : parsed.port,
		"path" : parsed.path
	};

	var req = http.request(options, function(res){

		var len = parseInt(res.headers['content-length'], 10),
			rec = 0;

		var text;
		var buffer;
		if(is_text){
			res.setEncoding('utf8'); // TODO: get encoding from content-type
			text = "";
		} else {
			// initialize a buffer of the required length
			buffer = new Buffer(len);
		}

		res.on('data', function(chunk){
			if(is_text){
				// chunk is string
				text += chunk;
			} else {
				// chunk is Buffer
				chunk.copy(buffer, rec);
				rec += chunk.length;
			}
		});

		res.on('end', function(){
			if(is_text){
				if(type == "json") result = JSON.parse(text);
				else result = text;
			} else {
				// convert buffer to correct type
				var constructor = loader.TYPE_MAP[type];
				// node 4.x and later
				// https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer/31394257#31394257
				result = new constructor(buffer.buffer, buffer.byteOffset, buffer.byteLength / constructor.BYTES_PER_ELEMENT);
			}
			return callback(null, result, type);
		});
	});

	req.end();
}

function loadall(){
	// network or filesystem?
	var filesystem = true;

	if(filesystem){
		//loader.loadall
	} else {
		//netloader.loadall
	}
}
