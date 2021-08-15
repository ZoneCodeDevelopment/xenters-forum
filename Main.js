const bodyparser = require('body-parser')
const jsonfile = require('jsonfile')
const express = require('express')
const bcrypt = require('bcrypt')
const fs = require('fs')
const app = express()
const logger = require('./utils/LogUtil')
const path = require('path')
const invites = require('./genCodes')

const dirPath = path.join(__dirname, 'invites')

app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({extended: true}))
//app.use(express.json())
let inviteCounter = 0;

let inviteString = [];
const PORT = 80

app.get('/panel', (req, res) => {

    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }
    if(ip === '::1') {
        ip = 'LOCAL IP';
    }


    if(fs.existsSync(`loggedin/${ip}`)) {
        let uname = fs.readFileSync(`loggedin/${ip}`);
        if(fs.existsSync(`users/${uname}.json`)) {
            let userFile = jsonfile.readFileSync(`users/${uname}.json`);
            let rank = userFile.rank;
            let messages = fs.readFileSync('./data/chat/chat').toString()
            fs.readdir(dirPath, function(err, files) {
                if(err) {
                    console.log(`Unable to scan directory: ${err}`)
                }
                files.forEach(function(file) {
                    let fileContent = fs.readFileSync(`invites/${file}`).toString()
                    if(fileContent === `${uname}`) {
                        inviteCounter++;
                        inviteString.push(file.toString())
                    }
                })
            })
            let messagessplit = messages.split('\\\\')
            if(inviteCounter > 0) {
                res.render('panel', { userRank: rank, invites: "true", invitesnum: inviteCounter, invitecodes: inviteString, chatMessages: messagessplit})
                inviteString = []
                inviteCounter = 0;
            } else {
                res.render('panel', { userRank: rank, invites: "false", invitesnum: "0", invitecodes: "", chatMessages: messagessplit });
            }
        } else {
            res.send('Your account was not found please message support!')
        }
    } else {
         res.redirect('login');
    }

});

app.post('/sendmessage', (req, res) => {

    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }
    if(ip === '::1') {
        ip = 'LOCAL IP';
    }


    if(fs.existsSync(`loggedin/${ip}`)) {
        let uname = fs.readFileSync(`loggedin/${ip}`);
        if(fs.existsSync(`users/${uname}.json`)) {
            fs.appendFileSync('./data/chat/chat', `${uname}: ${req.body.messagesent}\\\\`)
            res.redirect('panel');
        } else {
            res.send('Your account was not found please message support!')
        }
    } else {
         res.send('not logged in');
    }

});

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }
    if(ip === '::1') {
        ip = 'LOCAL IP';
    }
    if(fs.existsSync(`loggedin/${ip}`)) {
         res.redirect('panel');
    } else {
        res.render('login')  
    }
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    console.log("test")
    let email = req.body.mail,
    password = `${req.body.pass}`,
    invite = `${req.body.inv}`,
    username = req.body.user
    let inviter1 = "test";
    if(fs.existsSync(`invites/${invite}`)) {
        inviter1 = fs.readFileSync(`invites/${invite}`).toString();
    }
    uidlast = parseInt(fs.readFileSync('uidcounter/uid').toString());
    uid = uidlast+1;
    uidString = `${uid}`;
    fs.writeFileSync('uidcounter/uid', uidString)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = {
            email: email,
            password: hashedPassword,
            inviter: inviter1,
            username: username,
            rank: "user",
            uid: uid
        }
    
        let data = JSON.stringify(user, null, 4)
        if(!fs.existsSync(`users/${username}.json`)) {
        if(fs.existsSync(`invites/${invite}`) && invite !== '') {
            fs.appendFileSync(`users/${username}.json`, data)
            fs.unlinkSync(`invites/${invite}`)
                res.redirect('login')
        }
        } else {
        res.send('Username Already Registered!')
        }
    } catch {
        res.status(500).send();
    }

})

app.post('/login', async (req, res) => {
    let username = req.body.fname
    let password = req.body.fpass

    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }


    try {
        if(fs.existsSync(`users/${username}.json`)) {
            let data = jsonfile.readFileSync(`users/${username}.json`)
            if((data.username === username) && (await bcrypt.compare(password, data.password))) {
                if(ip === '::1') {
                    ip = 'LOCAL IP';
                }
                fs.writeFileSync(`${__dirname}/loggedin/${ip}`, `${username}`)
                 res.redirect('panel');
            } else {
                res.send('INCORRECT PASSWORD OR EMAIL')
            } 
        }
    }catch {
        res.status(500).send();
    }
})

app.post('/logout', (req, res) => {
    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }
    if(ip === '::1') {
        ip = 'LOCAL IP';
    }
    if(fs.existsSync(`loggedin/${ip}`)) {
        fs.unlinkSync(`loggedin/${ip}`);
        res.redirect('login')
    } else {
        res.send('You are not logged in!')
    }
})

app.get('/dashboard', (req, res) => {
    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }
    if(ip === '::1') {
        ip = 'LOCAL IP';
    }
    if(fs.existsSync(`loggedin/${ip}`)) {
        let username = fs.readFileSync(`loggedin/${ip}`);
        if(fs.existsSync(`users/${username}.json`)) {
            let userFile = jsonfile.readFileSync(`users/${username}.json`);
            let rank = userFile.rank;
            if(rank === 'admin') {
                res.render('dashboard')
            } else {
                res.send('You are not a admin are you?')
            }
        } else {
            res.send('Account not found, message support');
        }
    } else {
        res.send('You are not logged in');
    }
})

app.post('/genCodes', (req, res) => {
    let ip = req.ip
    if(ip.substr(0,7) === '::ffff:') {
        ip = ip.substr(7)
    }
    if(ip === '::1') {
        ip = 'LOCAL IP';
    }
    if(fs.existsSync(`loggedin/${ip}`)) {
        let username = fs.readFileSync(`loggedin/${ip}`);
        if(fs.existsSync(`users/${username}.json`)) {
            let userFile = jsonfile.readFileSync(`users/${username}.json`);
            let rank = userFile.rank;
            if(rank === 'admin') {
                invites();
                res.send('Invites Generated!')
            } else {
                res.send('You are not a admin are you?')
            }
        } else {
            res.send('Account not found, message support');
        }
    } else {
        res.send('You are not logged in');
    }
})

app.listen(PORT, () => {
    logger.log(`Server started on port ${PORT}`);
})