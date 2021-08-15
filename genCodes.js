const fs = require('fs');
const path = require('path')

const dirPath = path.join(__dirname, 'users')

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function genCodes() {
    fs.readdir(dirPath, function(err, files) {
        if(err) {
            console.log(`Unable to scan directory: ${err}`)
        }
        files.forEach(function(file) {
            let fname = file.split(".")
            let fileName = fname[0]
            for(let j = 0; j < 10; j++) {
                fs.writeFileSync(`invites/${makeid(5)}-${makeid(5)}-${makeid(5)}-${makeid(5)}`, fileName)
            }
        })
    })
}

module.exports = genCodes;