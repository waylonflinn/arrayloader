var fs = require('fs'),
	asyncMap = require('async/map');

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
			type = "uint8";
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

function load(path, type, callback) {
	var is_text = (type == "str" || type == "json");
	var constructor;
	if(!is_text){
		// get constructor for specified type
		constructor = type_map[type];
	}

	fs.readFile(path, is_text ? "utf-8" : null, function(err, data){
		if(err){
			return callback("Error loading " + path + ":\n\t" + err);
		}

		// text mode?
		if(is_text){
			var result;
			try{
				// parse as JSON and return result
				if(type == "json") result = JSON.parse(data);
				else result = data;
			} catch (e){
				return callback("Error loading " + path + ":\n\t" + e);
			}
			return callback(null, result, type);
		}

		var result;
		try{
			// parse according to type
			result = new constructor(data.buffer);
		} catch (e) {
			return callback("Error loading " + path + ":\n\t" + e);
		}
		return callback(null, result, type);
	});
};