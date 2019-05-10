var loader = require('./xhr-loader'),
	autotype = require('./autotype'),
	asyncMap = require('async/map');

module.exports = {
	"load" : autoload,
	"type" : autotype.type,
	"loadall" : autoloadall,
	"typeall" : typeall
};

function autoload(){
	var url = null,
		type = null,
		compression = null,
		shape = null,
		callback;

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
		autotype.type(url, function(err, type, compression, shape){
			if(err) return callback(err);
			return loader.load(url, type, compression, shape, callback);
		});
	} else if(compression !== null && typeof(compression) !== "undefined") {
		//console.log(compression);
		//console.log(type);
		let is_compression_type = (compression == autotype.COMPRESSION_TYPE && type in loader.TYPE_MAP);
		
		if(!is_compression_type)
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));
		
		return loader.load(url, type, compression, shape, callback);

	} else {
		if(!(type in loader.TYPE_MAP))
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));

		return loader.load(url, type, compression, shape, callback);
	}
}

function typeall(files, callback){
	asyncMap(files, autotype.type, callback);
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
