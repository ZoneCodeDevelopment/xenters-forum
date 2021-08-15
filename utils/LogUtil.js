const fs = require('fs')
module.exports = {
    /**
     * 
     * @param {String} message The message that is written in the daily log file and in the Console!
     * 
    */
    async log(message) {
        if (message) {
            var D = new Date,
                _d = `${D.getUTCDate()}.${D.getUTCMonth()+1}.${D.getUTCFullYear()}`
                _t = `${D.getUTCHours() +2}:${D.getUTCMinutes()}:${D.getUTCSeconds()}`
            if ( fs.existsSync(`data/logs/${_d}.txt`) ) {
                fs.appendFileSync(`data/logs/${_d}.txt`, `[${_t}] ${message}\n`)
                console.log(`[${_t}] ${message}`)
            } else {
                fs.writeFileSync(`data/logs/${_d}.txt`, `--== TOP OF DAILY LOG ==--\n`)
                fs.appendFileSync(`data/logs/${_d}.txt`, `[${_t}] ${message}\n`)
                console.log(`[${_t}] ${message}`)
            }
        } else {
            console.log('[ERROR] A message must be specified!') 
        }
    }
}