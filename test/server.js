var express = require('express');

var PORT = 8080;
var app = express();

// allow cross origin
app.all('*', function(req, res, next) {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.get('/data/json', function(req, res){
	res.set("Content-Type", "application/json");
	return res.json({"hello" : "world"});
});

app.get('/data/text', function(req, res){
	res.set("Content-Type", "text/plain");
	return res.end("hello world");
});

app.get('/data/uint8', function(req, res){
	res.set("Content-Type", "application/x-uint8");

	var arr = new Uint8Array([0, 1, 2, 3, 128]);
	return res.end(new Buffer(arr.buffer));
});

app.get('/data/int8', function(req, res){
	res.set("Content-Type", "application/x-int8");

	var arr = new Int8Array([0, 1, 2, 3, 127]);
	return res.end(new Buffer(arr.buffer));
});

app.get('/data/uint16', function(req, res){
	res.set("Content-Type", "application/x-uint16");

	var arr = new Uint16Array([0, 1, 2, 3, 1024]);
	return res.end(new Buffer(arr.buffer));
});

app.get('/data/float32', function(req, res){
	res.set("Content-Type", "application/x-float32");

	var arr = new Float32Array([1.23, 2.71828, 3.141592]);
	return res.end(new Buffer(arr.buffer));
});

console.log("starting test data server: " + PORT);
app.listen(PORT);
