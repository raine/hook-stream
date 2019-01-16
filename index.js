const { PassThrough } = require('stream')

module.exports = (hookedStream) => {
  const originalWrite = hookedStream.write.bind(hookedStream)
  const tmpStream = new PassThrough()

  const unhook = () => {
    hookedStream.write = originalWrite
  }

  hookedStream.write = (...args) => {
    tmpStream.write(...args)
    return originalWrite(...args)
  }

  return { unhook, stream: tmpStream }
}
