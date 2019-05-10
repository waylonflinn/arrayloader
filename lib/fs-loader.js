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

exports.load = load = function load(path, type, compression, shape, callback) {
	type = type || "uint8";
	var is_text = (type == "str" || type == "json");

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
		var result, final_shape;
		
		// get constructor for specified type
		var constructor = type_map[type];
		try{
			if(compression !== null && typeof(compression) !== "undefined"){
				// parse as compressed array

				// decompress and call constructor with decompressed buffer
				result = new constructor(lz4.decompress(new Uint8Array(data.buffer)).buffer);

			} else {
				// parse according to type and return result
				result = new constructor(data.buffer);
			}
		} catch(e){
			return callback("Error loading " + path + ":\n\t" + e);
		}

		// handle shape
		if(shape !== null && typeof(shape) !== "undefined"){
			let dimensions = shape.slice(0);
			let block_size = dimensions.reduce( (product, number) => (product * number), 1);

			if(result.length % block_size != 0)
				return callback(`Tensor dimensions ([${dimensions.join(', ')}]) not consistent with array size (${result.length}).`);

			let block_count = ~~(result.length / block_size);
			dimensions.unshift(block_count);
			final_shape = dimensions;
		}

		return callback(null, result, type, final_shape);
	});
};
