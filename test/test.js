var tape = require('tape'),
	loader = require('../lib/browser.js');
//	loader = require('../lib/index.js');

var RTOL = 1e-05,
	ATOL = 1e-07;

function close(a, b){
	return Math.abs(a - b) <= ATOL + RTOL * Math.abs(b);
}

function type(obj){ return Object.prototype.toString.call(obj).slice(8, -1); }

tape("explicit type: Float32Array", function(t){
	t.plan(6);

	loader.load('./test/data/a.buf', "float32", function(err, result, typ){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "object is Float32Array");
		t.equal(typ, "float32", "type is float32");

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
	t.plan(6);

	loader.load('./test/data/a.f32', function(err, result, typ){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "object is Float32Array");
		t.equal(typ, "float32", "type is float32");

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
	t.plan(6);

	var typ;
	loader.load('./test/data/a.f32', typ, function(err, result, typ2){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "object is Float32Array");
		t.equal(typ2, "float32", "type is float32");

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
	t.plan(6);

	loader.load('./test/data/a.json', function(err, result, typ){
		if(err) return t.end(err);

		t.equal(type(result), "Array", "object is Array");
		t.equal(typ, "json", "type is json");

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
	t.plan(6);

	loader.load('./test/data/a.jso', function(err, b, typ){
		if(err) return t.end(err);

		t.equal(type(b), "Uint8Array", "object is Uint8Array");
		t.equal(typ, "uint8", "type is uint8");

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
	t.plan(6);

	var typ;
	loader.load('./test/data/a.jso', typ, function(err, b, typ){
		if(err) return t.end(err);

		t.equal(type(b), "Uint8Array", "object is Uint8Array");
		t.equal(typ, "uint8", "type is uint8");

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
	t.plan(6);

	loader.load('./test/data/a.txt', "json", function(err, result, typ){
		if(err) return t.end(err);

		t.assert(type(result) == "Array", "object is array");
		t.equal(typ, "json", "type is json");

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
	t.plan(6);

	var typ;
	loader.load('./test/data/a.json', typ, function(err, result, typ){
		if(err) return t.end(err);

		t.assert(type(result) == "Array", "object is array");
		t.equal(typ, "json", "type is json");

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
	t.plan(6);

	loader.load('./test/data/a.txt', function(err, str, typ){
		if(err) return t.end(err);

		t.assert(type(str) == "String", "object is string");
		t.equal(typ, "str", "type is str");

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
	t.plan(6);

	loader.load('./test/data/a.json', "str", function(err, str, typ){
		if(err) return t.end(err);

		t.assert(type(str) == "String", "object is string");
		t.equal(typ, "str", "type is str");

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
	t.plan(6);

	var typ;
	loader.load('./test/data/a.txt', typ, function(err, str, typ){
		if(err) return t.end(err);

		t.assert(type(str) == "String", "object is string");
		t.equal(typ, "str", "type is str");

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

tape("two step automatic type: uint8", function(t){
	t.plan(9);

	loader.type('./test/data/c.u8', function(err, typ){
		loader.load('./test/data/c.u8', typ, function(err, result, typ2){
			if(err) return t.end(err);

			t.equal(type(result), "Uint8Array", "object is Uint8Array");
			t.equal(typ, "uint8", "type is uint8");
			t.equal(typ2, "uint8", "result type is uint8");

			var expected = 0;
			t.assert(close(result[0], expected), "value correct");

			expected = 1;
			t.assert(close(result[1], expected), "value correct");

			expected = 2;
			t.assert(close(result[2], expected), "value correct");

			expected = 4;
			t.assert(close(result[3], expected), "value correct");

			expected = 8;
			t.assert(close(result[4], expected), "value correct");

			expected = 16;
			t.assert(close(result[5], expected), "value correct");
		});
	});
});

tape("two step automatic type: uint8-k", function(t){
	t.plan(9);

	loader.type('./test/data/c.k8', function(err, typ){
		loader.load('./test/data/c.k8', typ, function(err, result, typ2){
			if(err) return t.end(err);

			t.equal(type(result), "Uint8Array", "object is Uint8Array");
			t.equal(typ, "uint8-k", "type is uint8-k");
			t.equal(typ2, "uint8-k", "result type is uint8-k");

			var expected = 0;
			t.assert(close(result[0], expected), "value correct");

			expected = 1;
			t.assert(close(result[1], expected), "value correct");

			expected = 2;
			t.assert(close(result[2], expected), "value correct");

			expected = 4;
			t.assert(close(result[3], expected), "value correct");

			expected = 8;
			t.assert(close(result[4], expected), "value correct");

			expected = 16;
			t.assert(close(result[5], expected), "value correct");
		});
	});
});

/* NOTE: all tests after this point require server.js to be running
	```
	node server.js
	```
*/

tape("explicit type on api: Float32Array", function(t){
	t.plan(6);

	var typ = "float32";
	loader.load('http://localhost:8080/data/float32', typ, function(err, result, typ2){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "object is Float32Array");
		t.equal(typ2, "float32", "type is float32");

		t.equal(result.length, 3, "length is correct");

		var expected = 1.23;
		t.assert(close(result[0], expected), "value correct");

		expected = 2.71828;
		t.assert(close(result[1], expected), "value correct");

		expected = 3.141592;
		t.assert(close(result[2], expected), "value correct");
	});

});

tape("automatic type on api (mime): Float32Array", function(t){
	t.plan(6);

	var typ;
	loader.load('http://localhost:8080/data/float32', typ, function(err, result, typ2){
		if(err) return t.end(err);

		t.assert(type(result) == "Float32Array", "object is Float32Array");
		t.equal(typ2, "float32", "type is float32");

		t.equal(result.length, 3, "length is correct");

		var expected = 1.23;
		t.assert(close(result[0], expected), "value correct");

		expected = 2.71828;
		t.assert(close(result[1], expected), "value correct");

		expected = 3.141592;
		t.assert(close(result[2], expected), "value correct");
	});

});

tape("automatic type on api (mime): Uint16Array", function(t){
	t.plan(8);

	var typ;
	loader.load('http://localhost:8080/data/uint16', typ, function(err, result, typ2){
		if(err) return t.end(err);

		t.assert(type(result) == "Uint16Array", "object is Uint16Array");
		t.equal(typ2, "uint16", "type is uint16");

		t.equal(result.length, 5, "length is correct");

		// 0, 1, 2, 3, 1024
		var expected = 0;
		t.assert(close(result[0], expected), "value correct");

		expected = 1;
		t.assert(close(result[1], expected), "value correct");

		expected = 2;
		t.assert(close(result[2], expected), "value correct");

		expected = 3;
		t.assert(close(result[3], expected), "value correct");

		expected = 1024;
		t.assert(close(result[4], expected), "value correct");
	});

});

tape("automatic type on api (mime): str", function(t){
	t.plan(3);

	var typ;
	loader.load('http://localhost:8080/data/text', typ, function(err, result, typ2){
		if(err) return t.end(err);

		t.equal(type(result), "String", "object is String");
		t.equal(typ2, "str", "type is str");

		var expected = "hello world";
		t.equal(result, expected, "value correct");
	});

});

tape("automatic type on api (mime): json", function(t){
	t.plan(3);

	var typ;
	loader.load('http://localhost:8080/data/json', typ, function(err, result, typ2){
		if(err) return t.end(err);

		t.equal(type(result), "Object", "object is Object");
		t.equal(typ2, "json", "type is json");

		var expected = {"hello":"world"};
		t.equal(JSON.stringify(result), JSON.stringify(expected), "value correct");
	});

});

// test separate type and load
tape("two step automatic type on api (mime): int8", function(t){
	t.plan(7);

	loader.type('http://localhost:8080/data/int8', function(err, typ){
		loader.load('http://localhost:8080/data/int8', typ, function(err, result, typ2){
			if(err) return t.end(err);

			t.equal(type(result), "Int8Array", "object is Int8Array");
			t.equal(typ, "int8", "type is int8");

			var expected = [0, 1, 2, 3, 127];
			var expected = 0;
			t.assert(close(result[0], expected), "value correct");

			expected = 1;
			t.assert(close(result[1], expected), "value correct");

			expected = 2;
			t.assert(close(result[2], expected), "value correct");

			expected = 3;
			t.assert(close(result[3], expected), "value correct");

			expected = 127;
			t.assert(close(result[4], expected), "value correct");
		});
	});
});

// test type on keyed columns
tape("two step automatic type on api keyed column (mime): uint8-k", function(t){
	t.plan(6);

	loader.type('http://localhost:8080/data/uint8encode', function(err, typ){
		loader.load('http://localhost:8080/data/uint8encode', typ, function(err, result, typ2){
			if(err) return t.end(err);

			t.equal(type(result), "Uint8Array", "object is Uint8Array");
			t.equal(typ, "uint8-k", "type is uint8-k");
			t.equal(typ2, "uint8-k", "result type is uint8-k");

			var expected = [0, 1, 2];
			var expected = 0;
			t.assert(close(result[0], expected), "value correct");

			expected = 1;
			t.assert(close(result[1], expected), "value correct");

			expected = 2;
			t.assert(close(result[2], expected), "value correct");
		});
	});
});

// test type on keyed columns
tape("typeall: files", function(t){
	t.plan(3);

	var files = ['a.json', 'a.f32', 'c.u8'];
	var prefix = './test/data/';
	var urls = files.map(function(file){ return prefix + file});
	var expected = ['json', 'float32', 'uint8']; //

	loader.typeall(urls, function(err, types){
		t.equal(types[0], expected[0], 'type correct');
		t.equal(types[1], expected[1], 'type correct');
		t.equal(types[2], expected[2], 'type correct');
	});
});

// test type on keyed columns
tape("typeall: api", function(t){
	t.plan(4);

	var files = ['float32', 'int8', 'json', 'uint16'];
	var prefix = 'http://localhost:8080/data/';
	var urls = files.map(function(file){ return prefix + file});
	var expected = files.slice(0); //

	loader.typeall(urls, function(err, types){
		t.equal(types[0], expected[0], 'type correct');
		t.equal(types[1], expected[1], 'type correct');
		t.equal(types[2], expected[2], 'type correct');
		t.equal(types[3], expected[3], 'type correct');
	});
});

// test type on keyed columns
tape("loadall: files", function(t){
	t.plan(6);

	var files = ['a.json', 'a.f32', 'c.u8'];
	var prefix = './test/data/';
	var urls = files.map(function(file){ return prefix + file});
	var expected = ['json', 'float32', 'uint8']; //

	loader.loadall(urls, function(err, results){
		var result = results[0];
		t.equal(type(result), 'Array', 'type correct');
		t.assert(close(result[1], 0.67103903629141171), 'value correct');

		result = results[1];
		t.equal(type(result), 'Float32Array', 'type correct');
		t.assert(close(result[1], 0.67103903629141171), 'value correct');

		result = results[2];
		t.equal(type(result), 'Uint8Array', 'type correct');
		t.assert(close(result[3], 4), 'value correct');
	});
});
