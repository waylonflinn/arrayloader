# arrayloader

TypedArray reading utility, Browserify aware.

Use `fs.readFile` when directly required. Use XHR when being browserified.

## Installation

	npm install arrayloader

## Example

```javascript
var loader = require('arrayloader');
loader.load('/path/to/file', loader.float32, function (err, arr) {
	// arr is a Float32Array
	console.log(arr);
});
```

## Credits
based on the simple, but fantastic [floader](https://github.com/curvedmark/floader)
