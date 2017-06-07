
var type_map = {
	"int8"   : Int8Array,
	"uint8"  : Uint8Array,
	"int16"  : Int16Array,
	"uint16" : Uint16Array,
	"int32"  : Int32Array,
	"uint32" : Uint32Array,
	"float32" : Float32Array,
	"float64" : Float64Array
};

var extension_map = {
	".i8"  : "int8",
	".u8"  : "uint8",
	".i16" : "int16",
	".u16" : "uint16",
	".i32" : "int32",
	".u32" : "uint32",
	".f32" : "float32",
	".f64" : "float64",
	".k8"  : "uint8",
	".k16" : "uint16"
};

exports.load = function autotype(){
	var url, type, constructor, callback;

	if(arguments.length === 2){
		url = arguments[0];
		callback = arguments[1];
		// infer type from extension, if possible
		var i = url.lastIndexOf(".");
		if(i !== -1) constructor = type_map[extension_map[url.slice(i)]];

	} else if(arguments.length === 3){
		url = arguments[0];
		type = arguments[1];
		callback = arguments[2];

		// get constructor from specified type, default to Uint8Array
		constructor = type_map[type] ? type_map[type] : Uint8Array;
	}

	return load(url, constructor, callback);
}


// if constructor == null, default to text mode
function load(url, constructor, callback) {
	var is_text = (constructor == null);
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300) {
			// text mode?
			if(is_text){
				try{
					// parse as JSON and return result
					return callback(null, JSON.parse(xhr.responseText));
				} catch (e){
					return callback(e);
				}
			}

			var arrayBuffer = xhr.response;
			if (arrayBuffer) {
				try{
					// parse according to type and return result
					return callback(null, new constructor(arrayBuffer));
				} catch (e){
					return callback(e);
				}
			} else {
				return callback("empty response");
			}

		} else {
			var err = new Error("failed to request file '" + url + "'");
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
