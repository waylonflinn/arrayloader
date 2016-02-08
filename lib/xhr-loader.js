exports.load = function(url, type, callback) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300) {
			var arrayBuffer = xhr.response;
			if (arrayBuffer) {
				try{

					// parse according to type
					var data = new type(arrayBuffer);

					// return result
					return callback(null, data);
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
		xhr.responseType = "arraybuffer";
		xhr.send(null);
	} catch (err) {
		callback(err);
	}
};
