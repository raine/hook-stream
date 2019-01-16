const { PassThrough } = require('stream')

module.exports = (hookedStream) => {
  const originalWrite = hookedStream.write.bind(hookedStream)
  const newStream = new PassThrough()

  const unhook = () => {
    hookedStream.write = originalWrite
    newStream.end()
  }

  hookedStream.write = (...args) => {
    newStream.write(...args)
    return originalWrite(...args)
  }

  return [ unhook, newStream ]
}
