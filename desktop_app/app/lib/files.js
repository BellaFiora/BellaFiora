const dbreader = require('osudb')
const conf = require('./priv/credentials')
const fs = require('fs')
const path = require('path')
const AppData = path.join(process.env.LOCALAPPDATA, 'Bella Fiora Desktop');
const ini = require('ini');



class Files {
    /**
     * Creates an INI file from a JavaScript object.
     * @param {string} name - The name of the file to be created, without the extension.
     * @param {Object} obj - The object containing the data to write into the INI file.
     */
    async createIni(name, obj) {
        let iniString = '';
        for (const section in obj) {
            iniString += `[${section}]\n`;
            for (const key in obj[section]) {
                iniString += `${key}=${obj[section][key]}\n`;
            }
            iniString += '\n';
        }
        fs.writeFile(path.join(AppData, `${name}.ini`), iniString, (err) => {
            if (err) {
                return false
            }
        });
    }
    /**
     * Checks the existence of a file.
     * @param {string} filePath - The full path of the file to check.
     * @returns {Promise<boolean>}
     */
    async check(filePath) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
                resolve(true)
            } else {
                resolve(false)
            }
        })

    }

    /**
     * Exports an object representing a collection of beatmaps in CLBF format.
     * Adds extensive error handling to ensure data integrity and handle common issues.
     * @param {Array} obj - The array of beatmaps to be exported.
     * @param {string} name - The name of the collection to export.
     * @returns {Promise<Object>} - An object containing formatted collection information.
     */
    async exportCLBF(obj, name) {
        if (!Array.isArray(obj)) {
            throw new Error("Invalid input: obj must be an array of beatmaps.");
        }
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error("Invalid input: name must be a non-empty string.");
        }

        const collectionContent = [];
        for (const beatmap of obj) {
            if (!beatmap || typeof beatmap !== 'object') {
                throw new Error("Invalid beatmap entry: each beatmap must be an object.");
            }
            if (!beatmap.data || typeof beatmap.data !== 'object') {
                throw new Error("Invalid data structure: each beatmap must include a 'data' object.");
            }

            const requiredFields = ['md5', 'beatmapId', 'beatmapSetId', 'title', 'creator', 'artist', 'difficulty'];
            for (const field of requiredFields) {
                if (!(field in beatmap.data)) {
                    throw new Error(`Missing ${field} in beatmap data.`);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 150));
            collectionContent.push({
                md5: beatmap.md5,
                bmid: beatmap.data.beatmapId,
                bmsetid: beatmap.data.beatmapSetId,
                title: beatmap.data.title,
                creator: beatmap.data.creator,
                artist: beatmap.data.artist,
                difficulty: beatmap.data.difficulty
            });
        }

        const finaleFile = {
            clbf_version: "1.0",
            collection_name: name,
            export_ts: new Date().toISOString(),
            player_create: new Date().toISOString(),
            collectionContent: collectionContent
        };

        return finaleFile;
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
module.exports = { Files, Ini }
