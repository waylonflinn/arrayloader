var fs = require('fs');

function type(obj){ return Object.prototype.toString.call(obj).slice(8, -1); }

exports.TYPE_MAP = type_map = {
	"int8"   : Int8Array,
	"uint8"  : Uint8Array,
	"int16"  : Int16Array,
	"uint16" : Uint16Array,
	"int32"  : Int32Array,
	"uint32" : Uint32Array,
	"float32" : Float32Array,
	"float64" : Float64Array,
	"json" : "json",
	"str" : "str"
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

exports.load = function autotype(){
	var url, type, constructor, callback;

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
			constructor = type_map[extension_map[url.slice(i)]];
		} else {
			constructor = Uint8Array;
		}
	} else {
		if(!(type in type_map))
			return callback("Type must be one of: " + Object.keys(type_map).join(", "));

		// get constructor from specified type, default to Uint8Array
		constructor = type_map[type];
	}

	return load(url, constructor, callback);
}

function load(path, constructor, callback) {
	var is_text = (type(constructor) == "String");

	fs.readFile(path, is_text ? "utf-8" : null, function(err, data){
		if(err){
			return callback(err);
		}

		// text mode?
		if(is_text){
			try{
				// parse as JSON and return result
				if(constructor == "json") return callback(null, JSON.parse(data));
				else return callback(null, data);
			} catch (e){
				return callback(e);
			}
		}

		try{
			// parse according to type
			return callback(null, new constructor(data.buffer));
		} catch (e) {
			return callback(e);
		}
	});
};
