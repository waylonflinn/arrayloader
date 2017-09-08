
var extension_map;
exports.EXTENSION_MAP = extension_map = {
	".i8"  : "int8",
	".u8"  : "uint8",
	".i16" : "int16",
	".u16" : "uint16",
	".i32" : "int32",
	".u32" : "uint32",
	".f32" : "float32",
	".f64" : "float64",
	".k8"  : "uint8-k",
	".k16" : "uint16-k",
	".json" : "json",
	".key" : "json",
	".txt" : "str",
	".csv" : "str",
	".tsv" : "str"
};

var mime_map
exports.MIME_MAP = mime_map = {
	"application/x-int8"  : "int8",
	"application/x-uint8"  : "uint8",
	"application/x-uint8-k"  : "uint8-k",
	"application/x-int16" : "int16",
	"application/x-uint16" : "uint16",
	"application/x-uint16-k" : "uint16-k",
	"application/x-int32" : "int32",
	"application/x-uint32" : "uint32",
	"application/x-float32" : "float32",
	"application/x-float64" : "float64",
	"application/json" : "json",
	"text/plain" : "str"
};

var getMime;
exports.getMime = getMime = function getMime(content_type){
	//var base = xhr.getResponseHeader('content-type');

	var sep = content_type.indexOf(";");

	if(sep === -1) return content_type;
	else return content_type.slice(0, sep);
}

function getCharset(xhr){
	// "charset=utf-8"
	return "utf-8";
}

/*
else {
	type = "uint8";
}
*/
exports.type = autotype = function autotype(url, callback){

	var type = null;

	// check extension
	// infer type from extension, if possible
	var i = url.lastIndexOf(".");
	if(i !== -1 && url.slice(i) in extension_map){
		type = extension_map[url.slice(i)];

		return callback(null, type);
	}

	// check mime type (via content-type header)
	preflight(url, function(err, headers){

		if(err) return callback(err);

		var mime_type = getMime(headers['content-type']);
		if(mime_type && mime_type in mime_map){
			type = mime_map[mime_type];
		}

		return callback(null, type); // may be null, if not found
	});
}
/**https://gist.github.com/mmazer/5404301
 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
 * headers according to the format described here:
 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
 * This method parses that string into a user-friendly key/value pair object.
 */
function parseResponseHeaders(header_string) {
	var headers = {};
	if (!header_string) {
		return headers;
	}

	var header_pairs = header_string.split('\u000d\u000a'); // CRLF
	for (var i = 0; i < header_pairs.length; i++) {

		var pair = header_pairs[i];

		var index = pair.indexOf('\u003a\u0020'); // ': '
		if (index > 0) {
			var key = pair.substring(0, index).toLowerCase();
			var val = pair.substring(index + 2);
			headers[key] = val;
		}
	}
	return headers;
}

var preflight;
exports.preflight = preflight = function preflight(url, callback){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {

		// xhr.HEADERS_RECEIVED might be faster
		if (xhr.readyState !== 4) {
			return;
		}

		if (xhr.status >= 200 && xhr.status < 300) {

			var headers = {};
			// extract and return headers (in callback)
			var header_string = xhr.getAllResponseHeaders();
			//console.log(header_string);
			// parse header string
			var headers = parseResponseHeaders(header_string);

			return callback(null, headers);
		} else {
			var err = new Error("failed to request file '" + url + "'. " + xhr.statusText);
			// follow Node.js error signature
			err.errno = 34;
			callback(err);
		}
	};

	try {
		xhr.open('HEAD', url, true);
		xhr.send(null);
	} catch (err) {
		callback(err);
	}
}
