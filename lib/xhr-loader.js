
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

exports.load = function autotype(){
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

// if constructor == null, default to text mode
function load(url, type, callback) {
	var is_text = (type == "str" || type == "json");
	if(!is_text){
		// get constructor for specified type
		constructor = type_map[type];
	}

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
					if(type == "json") return callback(null, JSON.parse(xhr.responseText), type);
					else return callback(null, xhr.responseText, type);
				} catch (e){
					return callback(e);
				}
			}

			var arrayBuffer = xhr.response;
			if (arrayBuffer) {
				try{
					// parse according to type and return result
					return callback(null, new constructor(arrayBuffer), type);
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
