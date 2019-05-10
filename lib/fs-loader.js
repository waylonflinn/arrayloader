var fs = require('fs'),
	lz4 = require('lz4js');

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

exports.COMPRESSION_TYPE = COMPRESSION_TYPE = "lz4";

exports.load = load = function load(path, type, callback) {
	type = type || "uint8";
	var is_text = (type == "str" || type == "json");
	var is_complex_type = Array.isArray(type);

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
		var constructor;
		if(is_complex_type){
			if(type[0] == COMPRESSION_TYPE){
				// parse as compressed array

				// get constructor for specified type
				var constructor = type_map[type[1]];

				// decompress and call constructor with decompressed buffer
				result = new constructor(lz4.decompress(new Uint8Array(data.buffer)).buffer);
				
				// remove compression type from type list
				if(type.length == 2)
					type = type[1];
				else
					type = type.slice(1);

			} else {
				// get constructor for specified type
				var constructor = type_map[type[0]];
				// parse according to type and return result
				result = new constructor(data.buffer);
			}

			// handle shape
			if(Array.isArray(type) && type.length > 1){
				let dimensions = type.slice(1);
				let block_size = dimensions.reduce( (product, number) => (product * number), 1);

				if(result.length % block_size != 0)
					return callback(`Tensor dimensions ([${dimensions.join(', ')}]) not consistent with array size (${result.length}).`);

				let block_count = ~~(result.length / block_size);
				dimensions.unshift(block_count);

				type = [type[0]].concat(dimensions);
			}
		} else {
			// get constructor for specified type
			constructor = type_map[type];
			try{
				// parse according to type
				result = new constructor(data.buffer);
			} catch (e) {
				return callback("Error loading " + path + ":\n\t" + e);
			}
		}
		return callback(null, result, type);
	});
};
