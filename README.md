# hook-stream

Allows listening to a given stream's writes through a new, readable stream.

Useful for listening to a 3rd party library's writes to `stdout` or `stderr`.

## install

```sh
npm install --save hook-stream
```

## API

#### `hookStream(stream: Stream, options?: Object): [unhook: Function, readable: Stream]`

Takes a `stream` to hook into and optional `options` object.

Returns a tuple of `unhook` function and a newly created readable stream that
emits writes to `stream`.

## example

Direct writes to `stderr` to `stdout`.

```js
const hookStream = require('hook-stream')
const map = require('through2-map')
const treis = require('treis')

const [ unhook, stream ] = hookStream(process.stderr)

stream
  .pipe(map((x) => `STDOUT ${x}`))
  .pipe(process.stdout)

console.error('foo')
process.stderr.write('bar')
// treis prints function input and output to stderr
treis(x => x)(1)

unhook()
```

### output

```sh
% node examples/1.js
STDOUT foo
foo
STDOUT bar
bar
STDOUT λ1 x: 1
λ1 x: 1
STDOUT λ1 => 1
λ1 => 1
```

## caveat

This method does not work if a third party lib saves a reference to "original"
`stream.write` (e.g. `process.stderr.write`) before `hookStream` is called.

```js
// somewhere else, maybe in some lib's code
const log = process.stderr.write.bind(process.stderr)

// .....

// won't work because hookStream replaces process.stderr.write with its own
// function, but log already has reference to the original
const [ unhook, stream ] = hookStream(process.stderr)
```
