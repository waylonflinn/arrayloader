var loader = require('fs-loader'),
	autotype = require('autotype');

module.exports = {
	"load" : loader.load,
	"loadall" : loader.loadall,
	"autotype" : autotype.autotype
};

function load(){
	/*

} else {
	if(!(type in type_map || type == "str" || type == "json"))
		return callback("Type must be one of: " + Object.keys(type_map).join(", "));
}
*/
	// network or filesystem?
	var filesystem = true;

	if(filesystem){
		//loader.loadall
	} else {
		//netloader.loadall
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
