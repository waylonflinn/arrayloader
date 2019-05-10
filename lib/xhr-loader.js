
var lz4 = require('lz4js');


exports.TYPE_MAP = type_map = {
	"int8"   : Int8Array,
	"uint8"  : Uint8Array,
	"uint8-k"  : Uint8Array,
	"int16"  : Int16Array,
	"uint16" : Uint16Array,
	"uint16-k"  : Uint16Array,
	"int32"  : Int32Array,
	"uint32" : Uint32Array,
	"float32" : Float32Array,
	"float64" : Float64Array,
	"json" : Object,
	"str" : String
};



// if constructor == null, default to text mode
exports.load = load = function load(url, type, compression, shape, callback) {
	type = type || "uint8";
	var is_text = (type == "str" || type == "json");
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300) {

			// text mode?
			if(is_text){
				var result;
				try {
					// parse as JSON and return result
					if(type == "json") result = JSON.parse(xhr.responseText);
					else result = xhr.responseText;
				} catch (e){
					return callback("Error loading " + url + ":\n\t" + e);
				}
				return callback(null, result, type);
			} else if (xhr.response) {
				var result;
				var final_shape;
				try {
					// get constructor for specified type
					var constructor = type_map[type];

					if(compression !== null && typeof(compression) !== "undefined"){
						// parse as compressed array

						// decompress and call constructor with decompressed buffer
						result = new constructor(lz4.decompress(new Uint8Array(xhr.response)).buffer);

					} else {
						// parse according to type and return result
						result = new constructor(xhr.response);
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
				} catch (e){
					return callback("Error loading " + url + ":\n\t" + e);
				}
				return callback(null, result, type, final_shape);
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
