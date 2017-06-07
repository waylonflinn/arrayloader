var fs = require('fs');

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
		if(i !== -1) type = type_map[extension_map[url.slice(i)]];

	} else if(arguments.length === 3){
		url = arguments[0];
		type = arguments[1];
		callback = arguments[2];

		// get constructor from specified type, default to Uint8Array
		constructor = type_map[type] ? type_map[type] : Uint8Array;
	}

	return load(url, constructor, callback);
}

function load(path, type, cb) {
	var is_text = (type == null);

	// text mode?
	if(is_text) return fs.readFile(path, "utf-8", cb);

	fs.readFile(path, null, function(err, data){
		if(err){
			return cb(err);
		}

		try{
			// parse according to type
			var arr = new type(data.buffer);

			return cb(null, arr);
		} catch (e) {
			return cb(e);
		}
	});
};
