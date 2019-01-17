const hookStream = require('../')
const treis = require('treis')
const map = require('through2-map')

const [ unhook, stream ] = hookStream(process.stderr)

stream
  .pipe(map((x) => `STDOUT ${x}`))
  .pipe(process.stdout)

console.error('foo')
process.stderr.write('bar\n')
// treis prints function input and output to stderr
treis(x => x)(1)

unhook()
