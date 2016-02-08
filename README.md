# arrayloader

TypedArray reading utility, Browserify aware.

Use `fs.readFile` when directly required. Use XHR when being browserified.

## Installation

	npm install arrayloader

## Example

```javascript
var loader = require('arrayloader');
loader.load('/path/to/arr.buf', Float32Array, function (err, arr) {
	// arr is a Float32Array
	console.log(arr);
});
```

write compatible arrays from `numpy` like this,

```python
# given array 'a'
f = open('/path/to/arr.buf', 'wb')
f.write(a.astype(np.float32).tostring())
f.close
```

## Credits
based on the simple, but fantastic [floader](https://github.com/curvedmark/floader)
