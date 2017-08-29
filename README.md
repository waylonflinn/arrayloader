# arrayloader

TypedArray reading utility, Browserify aware.

Uses `fs.readFile` in node, and XHR when browserified.

## Installation

	npm install arrayloader

Note: relies on `TextDecoder` for API functionality (a polyfill can be found at [inexorabletash/text-encoding](https://github.com/inexorabletash/text-encoding))

## Example

```javascript
var loader = require('arrayloader');
loader.load('/path/to/array.f32', function (err, arr) {
	// arr is a Float32Array
	console.log(arr);
});
```

write compatible arrays from `numpy` like this,

```python
# given array 'a'
f = open('/path/to/array.f32', 'wb')
f.write(a.astype(np.float32).tostring())
f.close
```
choose an extension for your file like this,

extension | TypedArray | numpy dtype | mime type
---------|------------|--------------|-----
i8   | `Int8Array`  | int8 | application/x-int8
u8   | `Uint8Array` | uint8 | application/x-uint8
i16  | `Int16Array` | int16 | application/x-int16
u16  | `Uint16Array`| uint16 | application/x-uint16
i32  | `Int32Array` | int32 | application/x-int32
u32  | `Uint32Array` | uint32 | application/x-uint32
f32  | `Float32Array`| float32 | application/x-float32
f64  | `Float64Array` | float64 | application/x-float64

or (for non-binary types) like this,

extension | type | mime type
---------|-------|-----
json   | json | application/json
key   | json | application/json
txt  | str | text/plain
csv  | str | text/plain
tsv  | str | text/plain

Extensions mapped to `json` will be parsed (with `JSON.parse`) before
returning.

## Details
This module can read text and binary files. It will attempt to infer type from the extension of the file. If the extension isn't recognized, the type defaults to `Uint8Array`.

Type inference can be overridden by supplying a second argument. If this argument
is supplied but not recognized, the function returns immediately with an error. If supplied, this argument should be a string containing any of the values listed in the "numpy dtype" column from the first table or the "type" column from the second.

## Notes
Extensions for binary types differ from the numpy dtype short form in one way. The numpy short dtype specifies number of bytes, this module uses the number of bits (just as in the long form).

## Credits
based on the simple, but fantastic [floader](https://github.com/curvedmark/floader)
