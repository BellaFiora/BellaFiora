const ini = require('ini');
const fs = require('fs'); 
const path = require('path')
const conf = require('./priv/credentials');
const AppData = path.join(process.env.LOCALAPPDATA, 'Bella Fiora Desktop');

class Settings {
    constructor() {
		this.Conf = new conf() 
		this.ini = ini.parse((fs.readFileSync(path.join(AppData, '/userPreferences.ini'))).toString())
      
	}
    get(cat, key){
        return this.ini[cat][key]
    }
    edit(cat, key, value){
        this.ini[cat][key] = value
		fs.writeFileSync(
			path.join(AppData, '/userPreferences.ini'),
			ini.stringify(this.ini), 'utf8')
    }
    getAll() {
        let settings = JSON.parse(JSON.stringify(this.ini))
        let flatSettings = {};
        for (let category in settings) {
            let properties = settings[category];
            for (let key in properties) {
                flatSettings[key] = properties[key];
            }
        }
        return flatSettings;

    }
    
}

module.exports = Settings