'use strict'

const path = require('path')
const through = require('through2')

var shimmed = {}

module.exports = function (file) {
  return path.extname(file) !== '.js' ? through() : through((buf, enc, next) => {
    var code = buf.toString('utf8')

    if (!shimmed[file] && /\bPromise\b/.test(code)) {
      if (/['"]use strict['"]/.test(code)) {
        code = code.replace(/['"]use strict['"]/, '\'use strict\'\nvar Promise = require(\'promise-polyfill\')\n')
      } else {
        code = 'var Promise = require(\'promise-polyfill\')\n' + code
      }

      shimmed[file] = true
    }

    next(null, code)
  })
}
