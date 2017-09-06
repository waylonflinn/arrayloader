var fs = require('fs');

exports.TYPE_MAP = type_map = {
	"int8"   : Int8Array,
	"uint8"  : Uint8Array,
	"uint8-k"  : Uint8Array,
	"int16"  : Int16Array,
	"uint16" : Uint16Array,
	"uint16-k" : Uint16Array,
	"int32"  : Int32Array,
	"uint32" : Uint32Array,
	"float32" : Float32Array,
	"float64" : Float64Array,
	"json" : Object,
	"str" : String
};

exports.load = load = function load(path, type, callback) {
	type = type || "uint8";
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
