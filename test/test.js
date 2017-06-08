var tape = require('tape'),
	//loader = require('../lib/xhr-loader.js');
	loader = require('../lib/loader.js');

var RTOL = 1e-05,
	ATOL = 1e-07;

function close(a, b){
	return Math.abs(a - b) <= ATOL + RTOL * Math.abs(b);
}

tape("explicit type: Float32Array", function(t){
	t.plan(4);

	loader.load('./test/data/a.buf', "float32", function(err, result){
		if(err) t.fail(err);

		t.equal(result.length, 4096, "lengths equal");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "values equal");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "values equal");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "values equal");
	});

});

tape("automatic type: Float32Array", function(t){
	t.plan(4);

	loader.load('./test/data/a.f32', function(err, result){
		if(err) t.fail(err);

		t.equal(result.length, 4096, "lengths equal");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "values equal");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "values equal");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "values equal");
	});

});

// TIP: convert to normal array
// Array.prototype.slice.call(typedArray);

// text mode
tape("automatic type: text mode", function(t){
	t.plan(4);

	loader.load('./test/data/a.json', function(err, result){
		if(err) t.fail(err);

		t.equal(result.length, 4096, "lengths equal");

		var expected = 0.3100370605351459;
		t.assert(close(result[0], expected), "values equal");

		expected = 0.67103903629141171;
		t.assert(close(result[1], expected), "values equal");

		expected = 0.88289048726788111;
		t.assert(close(result[4095], expected), "values equal");
	});

});

// TIP: write TypeArray to file
// fs.writeFileSync("b.buf",  new Buffer(b.buffer));

// default to Uint8Array
tape("explicit type: default", function(t){
	t.plan(4);

	loader.load('./test/data/b.buf', true, function(err, result){
		if(err) t.fail(err);

		t.equal(result.length, 256, "lengths equal");

		var expected = 4;
		t.assert(close(result[0], expected), "values equal");

		expected = 5;
		t.assert(close(result[1], expected), "values equal");

		expected = 255;
		t.assert(close(result[251], expected), "values equal");
	});

});
