var fs = require('fs');

exports.load = function (path, type, cb) {
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
