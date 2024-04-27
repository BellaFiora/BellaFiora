const ini = require('ini');
const fs = require('fs'); 
const path = require('path')
const conf = require('./priv/credentials');


class Settings {
    constructor() {
        this.Conf = new conf();
        this.LocalApp = this.Conf.getConf('LocalPath')
        this.filePath = path.join(this.LocalApp, 'userPreferences.ini');
        this.ini = {}
    }


    async load(){
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf8', (err, data) => {
                this.ini = data
                if(err){
                    this.ini = {}
                } else {
                    this.ini = ini.parse(data.toString())
                }
                resolve(this.ini)
            });
        })
       
    }
    get(cat, key) {

        return this.ini[cat] ? this.ini[cat][key] : undefined;
    }

    edit(cat, key, value) {
        if (!this.ini[cat]) {
            this.ini[cat] = {};
        }
        this.ini[cat][key] = value;
        this.saveSettings();
    }

    saveSettings() {
        const filePath = path.join(this.LocalApp, 'userPreferences.ini');
        try {
            fs.writeFileSync(filePath, ini.stringify(this.ini), 'utf8');
        } catch (error) {
            console.error("Erreur lors de l'écriture du fichier:", error);
        }
    }

    getAll() {
        const settings = JSON.parse(JSON.stringify(this.ini));
        const flatSettings = {};
        for (let category in settings) {
            const properties = settings[category];
            for (let key in properties) {
                flatSettings[key] = properties[key];
            }
        }
        return flatSettings;
    }
}

module.exports = Settings;