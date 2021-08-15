const express = require('express')
const app = express()
const fs = require('fs')
const logger  = require('./utils/LogUtil')
let ks = false

app.get('/', (req, res) => {
    if(fs.existsSync(`public/key/${req.query.key}`) && (req.query.key !== '')) {
        if(req.query.event === 'cdn') {
            if(fs.existsSync(`public/cdn/${req.query.args}`)) {
                res.sendFile(`public/cdn/${req.query.args}`, { root: __dirname })
            } else {
                res.send('File Not Found!')
            }
        } else if(req.query.event === 'assets') {
            if(fs.existsSync(`public/assets/${req.query.args}`)) {
                res.sendFile(`public/assets/${req.query.args}`, {root: __dirname})
            } else {
                res.send('File not Found')
            }
        } else {
            res.send('No Valid Event Given')
        }
    } else if(fs.existsSync(`private/key/${req.query.key}`) && (req.query.key !== '')) {
        //PRIVATER CDN UND PRIVATE ASSETS
        if(req.query.event === 'cdn') {
            if(fs.existsSync(`private/cdn/${req.query.args}`)) {
                res.sendFile(`private/cdn/${req.query.args}`, { root: __dirname })
            } else {
                res.send('File not Found')
            }
        } else if(req.query.event === 'assets') {
            if(fs.existsSync(`private/assets/${req.query.args}`)) {
                res.sendFile(`private/assets/${req.query.args}`, { root: __dirname })
            } else {
                res.send('File not Found')
            }
        } else if(req.query.event === 'killswitch') {
            if(req.query.args === 'true') {
                ks = true
                fs.writeFileSync('services/KillSwitch', ks.toString())
                res.send(`Status of KillSwitch changed to ${ks}`)
            } else if(req.query.args === 'false') {
                ks = false
                fs.writeFileSync('services/KillSwitch', ks.toString())
                res.send(`Status of KillSwitch changed to ${ks}`)
            } else if(req.query.args === 'check') {
                res.send(fs.readFileSync('services/KillSwitch'))
            } else {
                res.send('Illegal Argument Given')
            }
        } else {
            res.send('ILLEGAL EVENT GIVEN')
        }
    }
})

app.listen(8080, () => {
    logger.log(`Backend started on port 8080`);
});