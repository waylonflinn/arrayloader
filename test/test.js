var tape = require('tape'),
	loader = require('../lib/xhr-loader.js');
	//loader = require('../lib/loader.js');

var RTOL = 1e-05,
	ATOL = 1e-07;

function close(a, b){
	return Math.abs(a - b) <= ATOL + RTOL * Math.abs(b);
}

function type(obj){ return Object.prototype.toString.call(obj).slice(8, -1); }

tape("explicit type: Float32Array", function(t){
	t.plan(5);

	loader.load('./test/data/a.buf', "float32", function(err, result){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "type is Float32Array")

		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});

tape("automatic type: Float32Array", function(t){
	t.plan(5);

	loader.load('./test/data/a.f32', function(err, result){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "type is Float32Array")

		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});


tape("explicit type: falsy (Float32Array)", function(t){
	t.plan(5);

	var typ;
	loader.load('./test/data/a.f32', typ, function(err, result){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "type is Float32Array")

		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});

// TIP: convert to normal array
// Array.prototype.slice.call(typedArray);

// text mode
tape("automatic type: json", function(t){
	t.plan(5);

	loader.load('./test/data/a.json', function(err, result){
		if(err) return t.end(err);

		t.assert(type(result) == "Array", "type is array")

		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});

// TIP: write TypeArray to file
// fs.writeFileSync("b.buf",  new Buffer(b.buffer));

// default to Uint8Array
tape("explicit type: unrecognized", function(t){
	t.plan(1);

	loader.load('./test/data/b.buf', true, function(err, result){
		t.assert(err, "error should be thrown");
	});
});

tape("automatic type: unrecognized extension", function(t){
	t.plan(5);

	loader.load('./test/data/a.jso', function(err, b){
		if(err) return t.end(err);

		t.equal(type(b), "Uint8Array", "type is Uint8Array");

		var str = String.fromCharCode.apply(null, b);
		//console.log(str);

		var result = JSON.parse(str);
		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});


tape("explicity type: falsy (unrecognized extension)", function(t){
	t.plan(5);

	var typ;
	loader.load('./test/data/a.jso', typ, function(err, b){
		if(err) return t.end(err);

		t.equal(type(b), "Uint8Array", "type is Uint8Array");

		var str = String.fromCharCode.apply(null, b);
		//console.log(str);

		var result = JSON.parse(str);
		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});

tape("explicit type: json", function(t){
	t.plan(5);

	loader.load('./test/data/a.txt', "json", function(err, result){
		if(err) return t.end(err);

		t.assert(type(result) == "Array", "type is array")

		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});

tape("explicit type: falsy (json)", function(t){
	t.plan(5);

	var typ;
	loader.load('./test/data/a.json', typ, function(err, result){
		if(err) return t.end(err);

		t.assert(type(result) == "Array", "type is array")

		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});


tape("automatic type: str", function(t){
	t.plan(5);

	loader.load('./test/data/a.txt', function(err, str){
		if(err) return t.end(err);

		t.assert(type(str) == "String", "type is string")

		var result = JSON.parse(str);
		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});
});

tape("explicit type: str", function(t){
	t.plan(5);

	loader.load('./test/data/a.json', "str", function(err, str){
		if(err) return t.end(err);

		t.assert(type(str) == "String", "type is string")

		var result = JSON.parse(str);
		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});

tape("explicit type: falsy (str)", function(t){
	t.plan(5);

	var typ;
	loader.load('./test/data/a.txt', typ, function(err, str){
		if(err) return t.end(err);

		t.assert(type(str) == "String", "type is string")

		var result = JSON.parse(str);
		t.equal(result.length, 4096, "length is correct");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "value correct");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "value correct");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "value correct");
	});

});
