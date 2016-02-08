var tape = require('tape'),
	loader = require('../lib/xhr-loader.js');

tape("load", function(t){
	t.plan(1);

	loader.load('./test/data/a.buf', Float32Array, function(err, result){
		t.assert("lengths equal", result.length === 4096);
	});

});
