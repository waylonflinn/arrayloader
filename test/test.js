var tape = require('tape'),
	loader = require('../lib/xhr-loader.js');

var RTOL = 1e-05,
	ATOL = 1e-07;

function close(a, b){
	return Math.abs(a - b) <= ATOL + RTOL * Math.abs(b);
}

loader.load('./test/data/a.buf', Float32Array, function(err, result){

	tape("load: length", function(t){
		t.plan(1);

		t.assert("lengths equal", result.length === 4096);
	});

	tape("load: values 0", function(t){
		t.plan(1);
		var expected = 0.3100370605351459;

		t.assert("values", close(result[0], expected));
	});

	tape("load: values 1", function(t){
		t.plan(1);
		var expected = 0.67103903629141171;

		t.assert("values", close(result[1], expected));
	});

	tape("load: values 4095", function(t){
		t.plan(1);
		var expected = 0.88289048726788111;

		t.assert("values", close(result[4095], expected));
	});
});
