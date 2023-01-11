const fs = require('fs')
const path = require('path')

module.exports = {
    log(message, level = 'info', callback) {
        console.log(`${level} ${new Date().toISOString()} - ${message instanceof Error ? message.stack : message}\n`)
    }
}
