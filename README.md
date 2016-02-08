# arrayloader

TypedArray reading utility, Browserify aware.

Uses `fs.readFile` in node, and XHR when browserified.

## Installation

	npm install arrayloader

## Example

```javascript
var loader = require('arrayloader');
loader.load('/path/to/array.arr', Float32Array, function (err, arr) {
	// arr is a Float32Array
	console.log(arr);
});
```

write compatible arrays from `numpy` like this,

```python
# given array 'a'
f = open('/path/to/array.arr', 'wb')
f.write(a.astype(np.float32).tostring())
f.close
```

## Credits
based on the simple, but fantastic [floader](https://github.com/curvedmark/floader)
