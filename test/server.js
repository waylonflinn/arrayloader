var express = require('express');

var PORT = 8080;
var app = express();

app.get('/data/json', function(req, res){
	res.set("Content-Type", "application/json");
	return res.json([0, 1, 2, 3, 4, 7]);
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

app.get('/data/float32', function(req, res){
	res.set("Content-Type", "application/x-float32");

	var arr = new Float32Array([1.23, 2.71828, 3.141592]);
	return res.end(new Buffer(arr.buffer));
});

console.log("starting test data server: " + PORT);
app.listen(PORT);
