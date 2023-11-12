const fs = require('fs');
const path = require('path');
const DynamicStorage = require('../Modules/DynamicStorage')
const dynamicStorage = new DynamicStorage()

class LocalStorage {
    constructor() {
        this.beatmapFolder = path.join(__dirname, "../LocalStorage/Beatmaps");
        this.userFolder = path.join(__dirname, "../LocalStorage/Users");
        this.beatmapsetsFolder = path.join(__dirname, "../LocalStorage/Beatmapsets");
    }
    async ifUser(user) {
        try {
            var ifExist = await dynamicStorage.UserCheck(user);
            if(ifExist) {
                return await dynamicStorage.GetUser(user);
            } else {
                return false 
            }
        } catch (e) {
            return this.fileExists(user, this.userFolder);
        }
    }
    async ifBeatmap(id) {
        try {
            const ifExist = await dynamicStorage.UserBeatmap(id);
            return ifExist;
        } catch (e) {
            return this.fileExists(user, this.beatmapFolder);
        }
    }
    async ifBeatmapset(id) {
        try {
            const ifExist = await dynamicStorage.BeatmapCheckCheck(id);
            
            return ifExist;

        } catch (e) {
            return this.fileExists(user, this.beatmapsetsFolder);
        }
    }

    async getUser(user) {
        try {
            const ifExist = await dynamicStorage.GetUser(user)
            console.log(ifExist)

            return ifExist
        } catch(e) {
            console.error('The beatmapset does not exist in the DynamicStorage file system: '+e)
            const datas = await this.getFile(user, this.userFolder);
            return !datas ? false : datas;
        }    
    }

    async getBeatmap(id) {
        try {
            return await dynamicStorage.GetBeatmap(id)
        } catch(e) {
            console.error('The beatmapset does not exist in the DynamicStorage file system :'+e)
            const datas = await this.getFile(id, this.beatmapFolder);
            return !datas ? false : datas;
        }    
    }
    async getBeatmapset(id) {
        try {
            return await dynamicStorage.GetBeatmapset(id)
        } catch(e) {
            console.error('The beatmapset does not exist in the DynamicStorage file system :'+e)
            const datas = await this.getFile(user, this.beatmapsetsFolder)
            return !datas ? false : datas;

        }    
    }
    async fileExists(fileName, dir) {
        try {
            const fullPath = path.join(dir, fileName+".json");
            const stats = await fs.promises.stat(fullPath);
            if(stats){
                return true
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false;
            } else {
                throw error;
            }
        }
    }
    async getFile(fileName, dir) {
        try {
            const fullPath = path.join(dir, fileName+".json");
            const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error('The requested file does not exist.');
            } else {
                console.error('Error reading the file:', error);
            }
            return false;
        }
    }
    async addUser(fileName, userdata) {
        try {
            const fullPath = path.join(this.userFolder, `${fileName}.json`);
            await fs.promises.writeFile(fullPath, JSON.stringify(userdata));
            await dynamicStorage.SyncUsers(userdata)
            return true
        } catch (error) {
            console.error('Error adding user: :', error);
            return false
        }
    }
}
module.exports = LocalStorage;