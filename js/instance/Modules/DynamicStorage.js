const memoryCache = require('memory-cache');
const fs = require('fs');
const path = require('path');

class DynamicStorage {
    constructor() {
        this.Users = memoryCache.get('Users') || [];
        this.Beatmaps = memoryCache.get('Beatmaps') || [];
        this.Beatmapsets = memoryCache.get('Beatmapsets') || [];
    }
    async SyncData(data, arrayName) {
        if (arrayName === 'Users') {
            this.Users.push(data);
            memoryCache.put('Users', this.Users);
        } else if (arrayName === 'Beatmaps') {
            this.Beatmaps.push(data);
            memoryCache.put('Beatmaps', this.Beatmaps);
        } else if (arrayName === 'Beatmapsets') {
            this.Beatmapsets.push(data);
            memoryCache.put('Beatmapsets', this.Beatmapsets);
        } else {
            throw new Error('Array not found in memory-cache');
        }
    }
    async SyncUsers(data) {
        await this.SyncData(data, 'Users');
        console.table(this.Users)
        memoryCache.put('Users', this.Users); 
    }
    async SyncBeatmap(data) {
        await this.SyncData(data, 'Beatmaps');
        memoryCache.put('Beatmaps', this.Users); 
    }
    async SyncBeatmapSet(data) {
        await this.SyncData(data, 'Beatmapsets');
        memoryCache.put('Beatmapsets', this.Users); 
    }
    async UserCheck(userId, username) {
        console.table(memoryCache.get('Users'))
        const users = memoryCache.get('Users') || this.Users;
        return users.some(user => user.user_id === userId || user.username === username);
    }
    async BeatmapCheck(beatmapId) {
        const beatmaps = memoryCache.get('Beatmaps') || this.Beatmaps;
        return beatmaps.some(beatmap => beatmap.beatmap_id === beatmapId);
    }
    async BeatmapsetsCheck(beatmapsetId) {
        const beatmapsets = memoryCache.get('Beatmapsets') || this.Beatmapsets;
        return beatmapsets.some(beatmapset => beatmapset.beatmapset_id === beatmapsetId);
    }
    async GetUser(userId) {
        const users = memoryCache.get('Users') || this.Users;
        if (typeof userId === "string") {
            return users.find(user => user.user_id === userId);
        } else {
            return users.find(user => user.username === userId);
        }
    }
    async GetBeatmap(beatmapId) {
        const beatmaps = memoryCache.get('Beatmaps') || this.Beatmaps;
        return beatmaps.find(beatmap => beatmap.beatmap_id === beatmapId);
    }
    async GetBeatmapSet(beatmapsetId) {
        const beatmapsets = memoryCache.get('Beatmapsets') || this.Beatmapsets;
        return beatmapsets.find(beatmapset => beatmapset.beatmapset_id === beatmapsetId);
    }

    async Init() {
        const userDir = path.join(__dirname, '../LocalStorage/Users');
        const beatmapDir = path.join(__dirname, '../LocalStorage/Beatmaps');
        const beatmapsetDir = path.join(__dirname, '../LocalStorage/Beatmapsets');

        const userFiles = fs.readdirSync(userDir);
        const beatmapFiles = fs.readdirSync(beatmapDir);
        const beatmapsetFiles = fs.readdirSync(beatmapsetDir);

        const readAndStoreData = (files, destinationArray, directory) => {
            const data = [];
            files.forEach(file => {
                const filePath = path.join(directory, file);
                const fileData = fs.readFileSync(filePath, 'utf-8');
                const jsonData = JSON.parse(fileData);
                data.push(jsonData);
            });
            return data;
        };

        this.Users = readAndStoreData(userFiles, this.Users, userDir);
        this.Beatmaps = readAndStoreData(beatmapFiles, this.Beatmaps, beatmapDir);
        this.Beatmapsets = readAndStoreData(beatmapsetFiles, this.Beatmapsets, beatmapsetDir);

        memoryCache.put('Users', this.Users);
        memoryCache.put('Beatmaps', this.Beatmaps);
        memoryCache.put('Beatmapsets', this.Beatmapsets);
    }
}

module.exports = DynamicStorage;
