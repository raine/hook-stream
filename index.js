const { PassThrough } = require('stream')

const DEFAULT_OPTIONS = {
  // End the created stream when unhook is called
  endOnUnhook: true,

  // Call write on the hooked stream
  passthrough: true
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
    const res = newStream.write(...args)
    if (opts.passthrough) return originalWrite(...args)
    return res
  }

  return [unhook, newStream]
}
