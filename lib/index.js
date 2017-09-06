var loader = require('./fs-loader'),
	autotype = require('./autotype'),
	asyncMap = require('async/map');

module.exports = {
	"load" : autoload,
};

function autoload(){
	// TODO: check for filesystem or network
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
		// check extension
		// infer type from extension, if possible
		var i = url.lastIndexOf(".");
		if(i !== -1 && url.slice(i) in autotype.EXTENSION_MAP){
			type = extension_map[url.slice(i)];
		}

		return loader.load(url, type, callback);
	} else {
		if(!(type in loader.TYPE_MAP))
			return callback("Type must be one of: " + Object.keys(loader.TYPE_MAP).join(", "));

		return loader.load(url, type, callback);
	}

}

function loadall(){
	// network or filesystem?
	var filesystem = true;

	if(filesystem){
		//loader.loadall
	} else {
		//netloader.loadall
	}
}
