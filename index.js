const { PassThrough } = require('stream')

const DEFAULT_OPTIONS = {
  endOnUnhook: true
}

module.exports = (hookedStream, opts = {}) => {
  opts = { DEFAULT_OPTIONS, ...opts }
  const originalWrite = hookedStream.write.bind(hookedStream)
  const newStream = new PassThrough()

  const unhook = () => {
    hookedStream.write = originalWrite
    if (opts.endOnUnhook) newStream.end()
  }

  hookedStream.write = (...args) => {
    newStream.write(...args)
    return originalWrite(...args)
  }

  return [unhook, newStream]
}
