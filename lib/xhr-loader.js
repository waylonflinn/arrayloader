var asyncMap = require('async/map');

// Note: relies on `TextDecoder` for API functionality.
// polyfill: https://github.com/inexorabletash/text-encoding

exports.TYPE_MAP = type_map = {
	"int8"   : Int8Array,
	"uint8"  : Uint8Array,
	"int16"  : Int16Array,
	"uint16" : Uint16Array,
	"int32"  : Int32Array,
	"uint32" : Uint32Array,
	"float32" : Float32Array,
	"float64" : Float64Array,
	"json" : Object,
	"str" : String
};

exports.EXTENSION_MAP = extension_map = {
	".i8"  : "int8",
	".u8"  : "uint8",
	".i16" : "int16",
	".u16" : "uint16",
	".i32" : "int32",
	".u32" : "uint32",
	".f32" : "float32",
	".f64" : "float64",
	".k8"  : "uint8",
	".k16" : "uint16",
	".json" : "json",
	".key" : "json",
	".txt" : "str",
	".csv" : "str",
	".tsv" : "str"
};

exports.MIME_MAP = mime_map = {
	"application/x-int8"  : "int8",
	"application/x-uint8"  : "uint8",
	"application/x-int16" : "int16",
	"application/x-uint16" : "uint16",
	"application/x-int32" : "int32",
	"application/x-uint32" : "uint32",
	"application/x-float32" : "float32",
	"application/x-float64" : "float64",
	"application/json" : "json",
	"text/plain" : "str"
};

exports.load = autotype = function autotype(){
	var url, type, callback;

	if(arguments.length === 2){
		url = arguments[0];
		callback = arguments[1];

	} else if(arguments.length === 3){
		url = arguments[0];
		type = arguments[1];
		callback = arguments[2];
	}

	if(type == null){
		// infer type from extension, if possible
		var i = url.lastIndexOf(".");
		if(i !== -1 && url.slice(i) in extension_map){
			type = extension_map[url.slice(i)];
		} else {
			type = null; // "uint8"
		}
	} else {
		if(!(type in type_map || type == "str" || type == "json"))
			return callback("Type must be one of: " + Object.keys(type_map).join(", "));
	}

	return load(url, type, callback);
}
/* load list of files */
exports.loadall = function loadall(files, callback){
	asyncMap(files, autotype, callback);
}

function getMime(xhr){
	var base = xhr.getResponseHeader('content-type');

	var sep = base.indexOf(";");

	if(sep === -1) return base;
	else return base.slice(0, sep);
}

function getCharset(xhr){
	// "charset=utf-8"
	return "utf-8";
}

// if constructor == null, default to text mode
function load(url, type, callback) {
	var is_text = (type == "str" || type == "json");
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300) {
			// check mime type?
			if(type == null){
				var mime_type = getMime(xhr);
				if(mime_type && mime_type in mime_map){
					type = mime_map[mime_type];
				} else {
					type = "uint8";
				}
			}

			// text mode?
			if(is_text){
				var result;
				try{
					// parse as JSON and return result
					if(type == "json") result = JSON.parse(xhr.responseText);
					else result = xhr.responseText;
				} catch (e){
					return callback("Error loading " + url + ":\n\t" + e);
				}
				return callback(null, result, type);
			} else if (xhr.response) {
				var result;
				try{
					if(type === "str" || type === "json"){
						var decoder = new TextDecoder("utf-8");
						result = decoder.decode(xhr.response);
						if(type === "json") result = JSON.parse(result);
					} else {
						// get constructor for specified type
						var constructor = type_map[type];
						// parse according to type and return result
						result = new constructor(xhr.response);
					}
				} catch (e){
					return callback("Error loading " + url + ":\n\t" + e);
				}
				return callback(null, result, type);
			} else {
				return callback("empty response");
			}

		} else {
			var err = new Error("failed to request file '" + url + "'. " + xhr.statusText);
			// follow Node.js error signature
			err.errno = 34;
			callback(err);
		}
	};

	try {
		xhr.open('GET', url, true);
		if(!is_text) xhr.responseType = "arraybuffer";
		xhr.send(null);
	} catch (err) {
		callback(err);
	}
};
