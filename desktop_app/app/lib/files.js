const fs = require('fs');
const conf = require('./priv/credentials')
const path = require('path')
const AppData = path.join(process.env.LOCALAPPDATA, 'Bella Fiora Desktop');

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
        fs.writeFile(path.join(AppData,`${name}.ini`), iniString, (err) => {
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