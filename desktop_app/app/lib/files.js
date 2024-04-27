const dbreader = require('osudb')
const conf = require('./priv/credentials')
const fs = require('fs')
const path = require('path')
const AppData = path.join(process.env.LOCALAPPDATA, 'Bella Fiora Desktop');
const ini = require('ini');



class Files {
    async createIni(name, obj){
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
class Ini {
	constructor() {
		this.Conf = new conf() 
		this.ini = ini.parse((fs.readFileSync(path.join(
		this.Conf.getConf('AppPath'), '/config.ini'))).toString())
	}

	get(cat, key) {
		return this.ini[cat][key]
	}

	set(cat, key, value) {
		this.ini[cat][key] = value
		fs.writeFileSync(
			path.join(this.Conf.getConf('AppPath'), '/config.ini'),
			ini.stringify(this.ini), 'utf8')
	}
}
module.exports = {Files, Ini}
