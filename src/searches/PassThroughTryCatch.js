const { Transform } = require('stream')
const _ = require('lodash')

Object.setPrototypeOf(PassThroughTryCatch.prototype, Transform.prototype)
Object.setPrototypeOf(PassThroughTryCatch, Transform)

function PassThroughTryCatch(options) {
  if (!(this instanceof PassThroughTryCatch))
    return new PassThroughTryCatch(options)

  Transform.call(this, options)
}

PassThroughTryCatch.prototype._transform = function(chunk, encoding, cb) {
  try {
    cb(null, chunk)
  } catch (err) {
    this.emit('end')
  }
}

module.exports = PassThroughTryCatch
