const { XMLHttpRequest } = require("xmlhttprequest")
const { call } = require('app-utils')

global.XMLHttpRequest = XMLHttpRequest

module.exports = call