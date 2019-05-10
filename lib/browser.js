var loader = require('./xhr-loader'),
	autotype = require('./autotype'),
	asyncMap = require('async/map');

module.exports = {
	"load" : autoload,
	"type" : autotype.type,
	"loadall" : autoloadall,
	"typeall" : typeall
};

function autoload(){
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
		autotype.type(url, function(err, type){
			if(err) return callback(err);
			return loader.load(url, type, callback);
		});
	} else if(Array.isArray(type)) {
		let is_compression_type = (type[0] == loader.COMPRESSION_TYPE && type[1] in loader.TYPE_MAP);
		let is_standard_type = type[0] in loader.TYPE_MAP;
		
		if(!is_compression_type && !is_standard_type)
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));

		return loader.load(url, type, callback);
	} else {
		if(!(type in loader.TYPE_MAP))
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));

		return loader.load(url, type, callback);
	}

}

function typeall(files, callback){
	asyncMap(files, autotype.type, callback);
}

// take a tuple, upack it and call the loader
function loadhelper(tuple, callback){
	return autoload(tuple[0], tuple[1], callback);
}

/* load list of files */
function autoloadall(){
	var files, types, callback;

	if(arguments.length === 2){
		files = arguments[0];
		callback = arguments[1];
		types = files.map(function(file){ return null;});
	} else if(arguments.length === 3) {
		files = arguments[0];
		types = arguments[1];
		callback = arguments[2];
	}

	if(files.length !== types.length) return callback(new Error("Arrays of files and types must be same length."));

	var tuples = Array(files.length);
	for(var i = 0; i < tuples.length; i++){
		tuples[i] = [files[i], types[i]];
	}

	asyncMap(tuples, loadhelper, callback);
}
