const sqlite3 = require('sqlite3').verbose(); 
const { read } = require('fs');
const path = require('path');
const { callbackify } = require('util');
const AppData = path.join(process.env.LOCALAPPDATA, 'Bella Fiora Desktop');

class UserDatas{
    constructor(username) {
        this.username = username
        this.db = new sqlite3.Database(path.join(AppData, `${username}.db`), (err) => {
            if (err) {
                console.error('Error opening database ' + err.message);
            } else {
                this.initializeDatabase();
                
                console.log('Database connected and initialized!');
            }
            this.createUser()
        });
    }

    initializeDatabase() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                refreshDate TEXT,
                is_online INTEGER,
                country TEXT,
                username TEXT,
                userId INTEGER,
                has_supported INTEGER,
                is_restricted INTEGER,
                playmode TEXT,
                is_bot INTEGER,
                avatar_url TEXT,
                cover_url TEXT,
                std_global_rank INTEGER,
                std_country_rank INTEGER,
                std_accuracy REAL,
                std_plays_count INTEGER,
                std_total_score INTEGER,
                std_ranked_score INTEGER,
                std_clicks INTEGER,
                std_combo_max INTEGER,
                std_exp INTEGER,
                std_pp REAL,
                std_node_ssh INTEGER,
                std_node_ss INTEGER,
                std_node_sh INTEGER,
                std_node_s INTEGER,
                std_node_a INTEGER,
                std_level_current INTEGER,
                std_level_progress INTEGER,
                taiko_global_rank INTEGER,
                taiko_country_rank INTEGER,
                taiko_accuracy REAL,
                taiko_plays_count INTEGER,
                taiko_total_score INTEGER,
                taiko_ranked_score INTEGER,
                taiko_clicks INTEGER,
                taiko_combo_max INTEGER,
                taiko_exp INTEGER,
                taiko_pp REAL,
                taiko_node_ssh INTEGER,
                taiko_node_ss INTEGER,
                taiko_node_sh INTEGER,
                taiko_node_s INTEGER,
                taiko_node_a INTEGER,
                taiko_level_current INTEGER,
                taiko_level_progress INTEGER,
                fruits_global_rank INTEGER,
                fruits_country_rank INTEGER,
                fruits_accuracy REAL,
                fruits_plays_count INTEGER,
                fruits_total_score INTEGER,
                fruits_ranked_score INTEGER,
                fruits_clicks INTEGER,
                fruits_combo_max INTEGER,
                fruits_exp INTEGER,
                fruits_pp REAL,
                fruits_node_ssh INTEGER,
                fruits_node_ss INTEGER,
                fruits_node_sh INTEGER,
                fruits_node_s INTEGER,
                fruits_node_a INTEGER,
                fruits_level_current INTEGER,
                fruits_level_progress INTEGER,
                mania_global_rank INTEGER,
                mania_country_rank INTEGER,
                mania_accuracy REAL,
                mania_plays_count INTEGER,
                mania_total_score INTEGER,
                mania_ranked_score INTEGER,
                mania_clicks INTEGER,
                mania_combo_max INTEGER,
                mania_exp INTEGER,
                mania_pp REAL,
                mania_node_ssh INTEGER,
                mania_node_ss INTEGER,
                mania_node_sh INTEGER,
                mania_node_s INTEGER,
                mania_node_a INTEGER,
                mania_level_current INTEGER,
                mania_level_progress INTEGER,
                std_levels_tech_s1 INTEGER,
                std_levels_tech_s2 INTEGER,
                std_levels_tech_s3 INTEGER,
                std_levels_tech_s4 INTEGER,
                std_levels_tech_s5 INTEGER,
                std_levels_tech_s6 INTEGER,
                std_levels_tech_s7 INTEGER,
                std_levels_tech_s8 INTEGER,
                std_levels_tech_s9 INTEGER,
                std_levels_tech_s10 INTEGER,
                std_levels_jump_s1 INTEGER,
                std_levels_jump_s2 INTEGER,
                std_levels_jump_s3 INTEGER,
                std_levels_jump_s4 INTEGER,
                std_levels_jump_s5 INTEGER,
                std_levels_jump_s6 INTEGER,
                std_levels_jump_s7 INTEGER,
                std_levels_jump_s8 INTEGER,
                std_levels_jump_s9 INTEGER,
                std_levels_jump_s10 INTEGER,
                std_levels_speed_s1 INTEGER,
                std_levels_speed_s2 INTEGER,
                std_levels_speed_s3 INTEGER,
                std_levels_speed_s4 INTEGER,
                std_levels_speed_s5 INTEGER,
                std_levels_speed_s6 INTEGER,
                std_levels_speed_s7 INTEGER,
                std_levels_speed_s8 INTEGER,
                std_levels_speed_s9 INTEGER,
                std_levels_speed_s10 INTEGER,
                std_levels_alt_s1 INTEGER,
                std_levels_alt_s2 INTEGER,
                std_levels_alt_s3 INTEGER,
                std_levels_alt_s4 INTEGER,
                std_levels_alt_s5 INTEGER,
                std_levels_alt_s6 INTEGER,
                std_levels_alt_s7 INTEGER,
                std_levels_alt_s8 INTEGER,
                std_levels_alt_s9 INTEGER,
                std_levels_alt_s10 INTEGER
            );
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                mode TEXT,
                history_id INTEGER
            );
            CREATE TABLE IF NOT EXISTS rank_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                mode TEXT,
                beatmap_id TEXT,
                score_id TEXT,
                score INTEGER,
                maxcombo INTEGER,
                count50 INTEGER,
                count100 INTEGER,
                count300 INTEGER,
                countmiss INTEGER,
                countkatu INTEGER,
                countgeki INTEGER,
                perfect INTEGER,
                enabled_mods INTEGER,
                date TEXT,
                rank TEXT,
                pp REAL,
                replay_available INTEGER
            );
        `;
        this.db.exec(query, (err) => {
            if (err) {
                console.error('Failed to create tables ' + err.message);
            }
        });
    }

    readUser(callback) {
        this.db.get(`SELECT * FROM users WHERE username = ?`, [this.username], (err, row) => {
            if (err) {
                return console.error('Read error: ' + err.message);
            }
            callback(row);
        });
    }

    updateUser(field, newValue) {
        this.db.run(`UPDATE users SET ${field} = ? WHERE username = ?`, [newValue, this.username], function(err) {
            if (err) {
                console.error('Update error: ' + err.message);
            } else {
                console.log(`Row(s) updated: ${this.changes}`);
            }
        });
    }

    createUser() {
        this.readUser((callback)=>{
            if(!callback){
                this.db.run(`INSERT INTO users (username) VALUES (?)`, [this.username], function(err) {
                if (err) {
                   
                } else {
                   
                }
            });
            }
        })
    }

    addHistory(userId, mode, historyId) {
        this.db.run(`INSERT INTO history (userId, mode, history_id) VALUES (?, ?, ?)`, [userId, mode, historyId], function(err) {
            if (err) {
                console.error('Insert history error: ' + err.message);
            } else {
                console.log(`History added: ${this.lastID}`);
            }
        });
    }

    addRankHistory(userId, mode, rankData) {
        this.db.run(`INSERT INTO rank_history (userId, mode, beatmap_id, score_id, score, maxcombo, count50, count100, count300, countmiss, countkatu, countgeki, perfect, enabled_mods, date, rank, pp, replay_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, mode, rankData.beatmap_id, rankData.score_id, rankData.score, rankData.maxcombo, rankData.count50, rankData.count100, rankData.count300, rankData.countmiss, rankData.countkatu, rankData.countgeki, rankData.perfect, rankData.enabled_mods, rankData.date, rankData.rank, rankData.pp, rankData.replay_available], function(err) {
            if (err) {
                console.error('Insert rank history error: ' + err.message);
            } else {
                console.log(`Rank history added: ${this.lastID}`);
            }
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database: ' + err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    }

}

module.exports = UserDatas

































// let test = {
//     "basic_informations": {
//         "is_online": "0", //Boolean
//         "country": "FR", // Coutry Code
//         "username": "Puparia", //String Username
// 		"userId": "", //INT User ID
//         "has_supported": "1", //Boolean
//         "is_restricted": "0", //Boolean
//         "playmode": "osu", //Default Playmode String osu/taiko/fruits/mania
//         "is_bot": "0", //Boolean
//         "avatar_url": "", //url 
//         "cover_url": "" //url
//     },
//     "gameplay": {
//         "m0": { //Standard statistics
//             "levels": {
//                 "tech": {
//                     "s1": 0,
//                     "s2": 0,
//                     "s3": 0, 
//                     "s4": 0,
//                     "s5": 0,
//                     "s6": 0,
//                     "s7": 0,
//                     "s8": 0,
//                     "s9": 0,
//                     "s10": 0
//                   },
//                   "speed": {
//                     "s1": 0,
//                     "s2": 0,
//                     "s3": 0,
//                     "s4": 0,
//                     "s5": 0,
//                     "s6": 0,
//                     "s7": 0,
//                     "s8": 0,
//                     "s9": 0,
//                     "s10": 0
//                   },
//                   "alt": {
//                     "s1": 0,
//                     "s2": 0,
//                     "s3": 0,
//                     "s4": 0,
//                     "s5": 0,
//                     "s6": 0,
//                     "s7": 0,
//                     "s8": 0,
//                     "s9": 0,
//                     "s10": 0
//                   },
//                   "jump": {
//                     "s1": 0,
//                     "s2": 0,
//                     "s3": 0,
//                     "s4": 0,
//                     "s5": 0,
//                     "s6": 0,
//                     "s7": 0,
//                     "s8": 0,
//                     "s9": 0,
//                     "s10": 0
//                   }
//             },
//             "global_rank": 254068,
//             "country_rank": 8902,
//             "notes": {
//                 "ssh": 0,
//                 "ss": 3,
//                 "sh": 0,
//                 "s": 395,
//                 "a": 403
//             },
//             "accuracy": 93.9439,
//             "plays_count": 23646,
//             "total_score": 15553117119,
//             "ranked_score": 3944515133,
//             "clicks": 4057727,
//             "combo_max": 1534,
//             "music_gender": [array..],
//             "top_rank": [],
//             "level": {
//                 "current": 98,
//                 "progress": 58
//             },
//             "exp": 0,
//             "pp": 2769.95,
//             "history": [
//                 263003,
//                 263087,
//                 263151,
//                 263250,...
//             ],
//             "rank_history": [
//                 {
//                     "beatmap_id": "1067123",
//                     "score_id": "4520873114",
//                     "score": "2729699",
//                     "maxcombo": "360",
//                     "count50": "0",
//                     "count100": "29",
//                     "count300": "258",
//                     "countmiss": "0",
//                     "countkatu": "14",
//                     "countgeki": "38",
//                     "perfect": "0",
//                     "enabled_mods": "64",
//                     "user_id": "5146531",
//                     "date": "2023-10-13 21:12:06",
//                     "rank": "A",
//                     "pp": "154.968",
//                     "replay_available": "0"
//                 }
//             ],
//         }
//     },
//     "maps": [
//         "m110656": { //m+beatmap_id
//             "id": 2,
//             "beatmap_id": 110656,
//             "beatmapset_id": 33119,
//             "difficulty_rating": "1.98",
//             "mode": "osu",
//             "status": "ranked",
//             "total_length": 203,
//             "user_id": 672931,
//             "version": "Normal",
//             "accuracy": 3,
//             "ar": 4,
//             "bpm": "150.00",
//             "is_convert": null,
//             "count_circles": 149,
//             "count_sliders": 106,
//             "count_spinners": 3,
//             "cs": 3,
//             "deleted_at": "2024-02-23T00:09:48.000Z",
//             "drain": 3,
//             "hit_length": 186,
//             "is_scoreable": true,
//             "last_updated": "2014-05-18T17:22:13.000Z",
//             "mode_int": 0,
//             "passcount": 345844,
//             "playcount": 658264,
//             "ranked": 1,
//             "url": "https://osu.ppy.sh/beatmaps/110656",
//             "checksum": "ad5f2a85919c325b14404a7566cd9e58",
//             "max_combo": 412,
//             "artist": "F-777",
//             "artist_unicode": "F-777",
//             "creator": "TicClick",
//             "nsfw": false,
//             "offset": 0,
//             "play_count": 2539710,
//             "preview_url": null,
//             "spotlight": false,
//             "title": "He's a Pirate",
//             "title_unicode": "He's a Pirate",
//             "video": false,
//             "can_be_hyped": false,
//             "ranked_date": "2012-03-20T06:20:35.000Z",
//             "storyboard": false,
//             "submitted_date": "2011-07-10T13:19:59.000Z",
//             "tags": "newgrounds hans zimmer klaus badelt pirates of the caribbean hacksl heatkai jesse valentine featured artist"
//         },...
//     ] 
    
// }

// "refreshDate": "1713436271",
// "is_online": "0", //Boolean
// "country": "FR", // Coutry Code
// "username": "Puparia", //String Username
// "userId": "", //INT User ID
// "has_supported": "1", //Boolean
// "is_restricted": "0", //Boolean
// "playmode": "osu", //Default Playmode String osu/taiko/fruits/mania
// "is_bot": "0", //Boolean
// "avatar_url": "", //url 
// "cover_url": "" //url
// "m0.global_rank": "254068",
// "m0.country_rank": "8902",
// "m0.accuracy": "93.9439",
// "m0.plays_count": "23646",
// "m0.total_score": "15553117119",
// "m0.ranked_score": "3944515133",
// "m0.clicks": "4057727",
// "m0.combo_max": "1534",
// "m0.exp": "0",
// "m0.pp": "2769.95",
// "m0.node.ssh":"0",
// "m0.node.ss":"0",
// "m0.node.sh":"0",
// "m0.node.s":"0",
// "m0.node.a":"0",
// "m0.level.current":"0",
// "m0.level.progress":"0",
// "m1.global_rank": "254068",
// "m1.country_rank": "8902",
// "m1.accuracy": "93.9439",
// "m1.plays_count": "23646",
// "m1.total_score": "15553117119",
// "m1.ranked_score": "3944515133",
// "m1.clicks": "4057727",
// "m1.combo_max": "1534",
// "m1.exp": "0",
// "m1.pp": "2769.95",
// "m1.node.ssh":"0",
// "m1.node.ss":"0",
// "m1.node.sh":"0",
// "m1.node.s":"0",
// "m1.node.a":"0",
// "m1.level.current":"0",
// "m1.level.progress":"0",
// "m2.global_rank": "254068",
// "m2.country_rank": "8902",
// "m2.accuracy": "93.9439",
// "m2.plays_count": "23646",
// "m2.total_score": "15553117119",
// "m2.ranked_score": "3944515133",
// "m2.clicks": "4057727",
// "m2.combo_max": "1534",
// "m2.exp": "0",
// "m2.pp": "2769.95",
// "m2.node.ssh":"0",
// "m2.node.ss":"0",
// "m2.node.sh":"0",
// "m2.node.s":"0",
// "m2.node.a":"0",
// "m2.level.current":"0",
// "m2.level.progress":"0",
// "m3.global_rank": "254068",
// "m3.country_rank": "8902",
// "m3.accuracy": "93.9439",
// "m3.plays_count": "23646",
// "m3.total_score": "15553117119",
// "m3.ranked_score": "3944515133",
// "m3.clicks": "4057727",
// "m3.combo_max": "1534",
// "m3.exp": "0",
// "m3.pp": "2769.95",
// "m3.node.ssh":"0",
// "m3.node.ss":"0",
// "m3.node.sh":"0",
// "m3.node.s":"0",
// "m3.node.a":"0",
// "m3.level.current":"0",
// "m3.level.progress":"0",


// "std_levels_tech_s1":"0",
// "std_levels_tech_s2":"0",
// "std_levels_tech_s3":"0",
// "std_levels_tech_s4":"0",
// "std_levels_tech_s5":"0",
// "std_levels_tech_s6":"0",
// "std_levels_tech_s7":"0",
// "std_levels_tech_s8":"0",
// "std_levels_tech_s9":"0",
// "std_levels_tech_s10":"0",

// "std_levels_jump_s1":"0",
// "std_levels_jump_s2":"0",
// "std_levels_jump_s3":"0",
// "std_levels_jump_s4":"0",
// "std_levels_jump_s5":"0",
// "std_levels_jump_s6":"0",
// "std_levels_jump_s7":"0",
// "std_levels_jump_s8":"0",
// "std_levels_jump_s9":"0",
// "std_levels_jump_s10":"0",

// "std_levels_speed_s1":"0",
// "std_levels_speed_s2":"0",
// "std_levels_speed_s3":"0",
// "std_levels_speed_s4":"0",
// "std_levels_speed_s5":"0",
// "std_levels_speed_s6":"0",
// "std_levels_speed_s7":"0",
// "std_levels_speed_s8":"0",
// "std_levels_speed_s9":"0",
// "std_levels_speed_s10":"0",

// "std_levels_alt_s1":"0",
// "std_levels_alt_s2":"0",
// "std_levels_alt_s3":"0",
// "std_levels_alt_s4":"0",
// "std_levels_alt_s5":"0",
// "std_levels_alt_s6":"0",
// "std_levels_alt_s7":"0",
// "std_levels_alt_s8":"0",
// "std_levels_alt_s9":"0",
// "std_levels_alt_s10":"0",



// "beatmap_id": "1067123",
// "score_id": "4520873114",
// "score": "2729699",
// "maxcombo": "360",
// "count50": "0",
// "count100": "29",
// "count300": "258",
// "countmiss": "0",
// "countkatu": "14",
// "countgeki": "38",
// "perfect": "0",
// "enabled_mods": "64",
// "user_id": "5146531",
// "date": "2023-10-13 21:12:06",
// "rank": "A",
// "pp": "154.968",
// "replay_available": "0"