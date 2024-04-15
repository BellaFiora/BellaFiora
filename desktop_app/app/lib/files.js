const fs = require('fs');
const ini = require('ini');
const conf = require('./priv/credentials')
const path = require('path')

class files {
    async createIni(name, obj){
        const Conf = new conf()
        let iniString = '';
        for (const section in obj) {
            iniString += `[${section}]\n`;
            for (const key in obj[section]) {
                iniString += `${key}=${obj[section][key]}\n`;
            }
            iniString += '\n';
        }
        fs.writeFile(path.join(Conf.getConf('AppPath'),`${name}.ini`), iniString, (err) => {
            if (err) {
                return false
            } 
        });
    }
    async check(filePath){
        if (fs.existsSync(filePath)) {
            return true
        } else {
            return false
        }
    }
}

module.exports = files