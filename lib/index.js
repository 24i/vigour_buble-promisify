'use strict'

const path = require('path')
const through = require('through2')

module.exports = function (file) {
  return path.extname(file) !== '.js' ? through() : through((buf, enc, next) => {
    var code = buf.toString()

    if (/\bPromise\b/.test(code) && code.indexOf('var Promise = require(\'promise-polyfill\')') === -1) {
      if (/['"]use strict['"]/.test(code)) {
        code = code.replace(/['"]use strict['"]/, '\'use strict\'\nvar Promise = require(\'promise-polyfill\')\n')
      } else {
        code = 'var Promise = require(\'promise-polyfill\')\n' + code
      }
    }

    next(null, code)
  })
}
