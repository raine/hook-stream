const hookStream = require('./')
const through2 = require('through2')
const mapStream = (fn) =>
  through2(function(chunk, enc, callback) {
    this.push(fn(chunk))
    callback()
  })

const { unhook, stream } = hookStream(process.stderr)

stream
  .pipe(mapStream((x) => `STDOUT ${x}`))
  .pipe(process.stdout)

console.error('foo')
console.error('foo')
console.error('foo')
console.error('foo')

unhook()
