const { AppMetric, User, Maps} = require('/common/ressources/SequelizeShemas');
const db_bellafiora = require('./src/sequelize');
const axios = require('axios')
class DataManager{
    constructor(req){
        this.req = req
    }

    static GetUserInfos(req){
        return User.findOne({
            where: {
                user_id: req.query.user_id
            }
        }).then(async data =>{
            let basic_informations
            let statisticsUnits = {
                osu: {},
                taiko: {},
                fruits: {},
                mania: {}
            }
            let top_rank

            if(data){
                basic_informations = DataManager.FormatBasic(data)
                
            } else {
                // next
            }
            statisticsUnits.osu = DataManager.FormatStatistics(JSON.parse(data.osu))
            statisticsUnits.taiko = DataManager.FormatStatistics(JSON.parse(data.taiko))
            statisticsUnits.fruits = DataManager.FormatStatistics(JSON.parse(data.fruits))
            statisticsUnits.mania = DataManager.FormatStatistics(JSON.parse(data.mania))

            top_rank = await DataManager.GetTopRank(req)
            return { basic_informations, top_rank, statisticsUnits}
        })
    }
    static GetTopRank(req){
        let v1_baseURL = 'https://osu.ppy.sh/api'
        return new Promise(async (resolve, reject) => {
            const modTypes = ['osu', 'taiko', 'fruits', 'mania'];
            let topRanks = {
                osu: {},
                taiko: {},
                fruits: {},
                mania: {}
            }
            await User.findOne({
                where: {
                    user_id: req.query.user_id
                }
            }).then(async data =>{
                if(data){
                    for (const mod of modTypes) {
                        topRanks[mod] = JSON.parse(data[mod]).top_rank    
                    }
                } else {
                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    for (const mod of modTypes) {
                        topRanks[mod] = await fetch(v1_baseURL+'/get_user_best?'+`k=${process.env.osuapikey_2}&m=${mod}&u=${req.query.user_id}&type=id`,{ method:'GET'})
                        .then(response => response.json());
                        await delay(100);
                    }
                }
                resolve(topRanks)
            })     
        })
    }

    static FormatBasic(data){
        let ObjectPrototype = {
            is_online: data.is_online,
            country: data.country,
            username: data.username ,
            has_supported: data.has_supported,
            is_supporter: data.is_supporter,
            is_restricted: data.is_restricted,
            playmode: data.playmode,
            is_bot: data.is_bot,
            avatar_url: data.avatar_url,
            cover_url: data.cover_url,
        }
        return ObjectPrototype
    }

    static FormatClient(data){
        let ObjectPrototype = {
            user_id: this.client_id,
            first_use: data.first_use,
            last_use: data.last_use,
            last_login: data.last_login,
            session_id: this.client_id,
            api_key: 0,
            api_key_sttus: 0,
            api_requests: 0,
            ip: this.ipAddress,
            osu_token: this.osu_token,
        }

        return ObjectPrototype
    }

    static FormatStatistics(data){
        let ObjectPrototype = {
            global_rank: data.statistics ? data.statistics.global_rank : data.global_rank,
            country_rank: data.statistics ? data.statistics.country_rank : data.country_rank,
            notes : {
                ssh: data.statistics ? data.statistics.grade_counts.ssh : data.notes.ssh,
                sh: data.statistics ? data.statistics.grade_counts.sh : data.notes.sh,
                ss: data.statistics ? data.statistics.grade_counts.ss : data.notes.ss,
                s: data.statistics ? data.statistics.grade_counts.s : data.notes.s,
                a: data.statistics ? data.statistics.grade_counts.a : data.notes.a,
            },
            levels: {
                tech: data.levels.tech ? data.levels.tech : {},
                speed: data.levels.speed ? data.levels.speed : {},
                alt: data.levels.alt ? data.levels.alt : {},
                jump: data.levels.jump ? data.levels.jump : {},
            },
            accuracy: data.statistics ? data.statistics.hit_accuracy : data.hit_accuracy,
            plays_count: data.statistics ? data.statistics.play_count : data.play_count,
            total_score: data.statistics ? data.statistics.total_score : data.total_score,
            play_time: data.statistics ? data.statistics.grade_counts.play_time : data.play_time,
            pp: data.statistics ? data.statistics.pp : data.pp,
            level : {
                current: data.statisticst ? data.statistics.level.current : data.level.current,
                progress: data.statistics ? data.statistics.level.progress : data.level.progress
            },
            combo_max: data.statistics ? data.statistics.maximum_combo : data.combo_max,
            clicks: data.statistics ? data.statistics.total_hits : data.clicks,
            ranked_score: data.statistics ? data.statistics.ranked_score : data.ranked_score,
            history_rank: data.rank_history ? data.rank_history.data : data.history_rank,
            exp: data.statistics ? data.statistics.pp_exp : data.pp
        }

        return ObjectPrototype
    }

    static FormatMap(data){
        let ObjectPrototype = {

        }

        return ObjectPrototype
    }

    static FormatScore(data){
        let ObjectPrototype = {

        }

        return ObjectPrototype

    }

    async getUser(){
        return new Promise(async (resolve, reject) => {
            let { basic_informations, top_rank, statisticsUnits} = await DataManager.GetUserInfos(this.req)
            let ObjectPrototype = { 
                basic_informations,
                gameplay: {
                    osu: statisticsUnits.osu,
                    taiko: statisticsUnits.taiko,
                    fruits: statisticsUnits.fruits, 
                    mania: statisticsUnits.mania,
                    top_rank,
                    maps: {}
                }
            }
            resolve(ObjectPrototype)
        })
      



        // return new Promise((resolve, reject) => {
        //     User.findOne({
        //         where: {
        //             user_id: this.player_id
        //         }
        //     })
        //     .then(async user => {
        //         if (user) {     
        //             let player_data = {
        //                 basic_informations: {
        //                     is_online: user.is_online,
        //                     country: user.country,
        //                     username:user.username,
        //                     has_supported: user.has_supported,
        //                     is_supporter: user.is_supporter,
        //                     is_restricted: user.is_restricted,
        //                     playmode: user.playmode,
        //                     is_bot: user.is_bot,
        //                     avatar_url: user.avatar_url,
        //                     cover_url:user.cover_url,
        //                 },
        //                 gameplay: {
        //                     m0: JSON.parse(user.osu),
        //                     m1: JSON.parse(user.ctb),
        //                     m2: JSON.parse(user.taiko),
        //                     m3: JSON.parse(user.mania),
        //                 },
        //                 maps : []  
        //             }
                    // let tri = [];
                    // for (let i = 0; i < 4; i++) {
                    //     tri.push(player_data.gameplay[`m${i}`]?.top_rank || []);
                    // }         
                    // const ma = [].concat(...tri.map(e => e.map(map => map.beatmap_id)));
                    // try {
                    //     const md = await Maps.findAll({
                    //         where: {
                    //             beatmap_id: {
                    //                 [Op.or]: ma.map(id => parseInt(id, 10))
                    //             }
                    //           }
                    //     });
                    //     md.forEach(m => {
                    //       const mo = {};
                    //       mo[`m${m.beatmap_id}`] = Object.assign({}, m.dataValues);
                    //       player_data.maps.push(mo);
                    //     });
        //             } catch(e){
        //                 console.log(e)
        //             }
        //             resolve(JSON.stringify(player_data))
        //         } else {
        //             await FetchData(query).then(player_data => {
        //                 let p_data = JSON.parse(player_data)
        //                 let date = new Date()
        //                 let user
        //                 try {
        //                      user = {
        //                         user_id: query.user_id,
        //                         first_use: date,
        //                         last_use: date,
        //                         last_login: date,
        //                         session_id:query.idApp,
        //                         api_key: 0,
        //                         api_key_sttus: 0,
        //                         api_requests: 0,
                                
        //                         ip: query.ipAddress,
        //                         osu_token:query.osu_token,
    
        //                         is_online: p_data.basic_informations.is_online,  
        //                         country: p_data.basic_informations.country,
        //                         username: p_data.basic_informations.username,
        //                         has_supported: p_data.basic_informations.has_supported,
        //                         is_supporter: p_data.basic_informations.is_supporter,
        //                         is_restricted: p_data.basic_informations.is_restricted,
        //                         playmode: p_data.basic_informations.playmode,
        //                         is_bot: p_data.basic_informations.is_bot,
        //                         avatar_url: p_data.basic_informations.avatar_url,
        //                         cover_url: p_data.basic_informations.cover_url,
    
        //                         osu: JSON.stringify(p_data.gameplay.m0 ? p_data.gameplay.m0 : []),
        //                         ctb: JSON.stringify(p_data.gameplay.m1 ? p_data.gameplay.m1 : []),
        //                         taiko: JSON.stringify(p_data.gameplay.m2 ? p_data.gameplay.m2 : []),
        //                         mania: JSON.stringify(p_data.gameplay.m3 ? p_data.gameplay.m3 : []),
    
        //                     }
        //                 } catch(e){
        //                     console.log(e)
        //                 }
        //                 User.create(user).then(() => {
        //                     resolve(player_data)
        //                 }).catch(err => {
        //                     console.log(err)
        //                     resolve(player_data)
        //                 })  
        //             })
        //         }
        //     }).catch(err => {
               
        //     });
        // })
        
    }

}






// async function FetchData(req) {
//     let query = req.query
//     return new Promise(async (resolve, reject) => {
//         var osu_stats = {
//             m0: {
//                 levels: [
//                     {
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         speed: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         alt: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         jump: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         }
//                     }
//                 ],
//                 global_rank: 0,
//                 country_rank: 0,
//                 notes: {
//                     ssh: 0,
//                     ss: 0,
//                     sh: 0,
//                     s: 0,
//                     a: 0,
//                 },
//                 accuracy: 0,
//                 plays_count: 0,
//                 total_score: 0,
//                 ranked_score: 0,
//                 clicks: 0,
//                 combo_max: 0,
//                 music_gender: [],
//                 top_rank: [],
//                 play_time: 0,
//                 level: {
//                     current: 0,
//                     progress: 0,
//                 },
//                 exp: 0,
//                 pp: 0,
//                 history: [],
//                 rank_history: []
//             },
//             m3: {
//                 levels: [
//                     {
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         speed: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         alt: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         jump: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         }
//                     }
//                 ],
//                 global_rank: 0,
//                 country_rank: 0,
//                 notes: {
//                     ssh: 0,
//                     ss: 0,
//                     sh: 0,
//                     s: 0,
//                     a: 0,
//                 },
//                 accuracy: 0,
//                 plays_count: 0,
//                 total_score: 0,
//                 clicks: 0,
//                 combo_max: 0,
//                 music_gender: [],
//                 top_rank: [],
//                 play_time: 0,
//                 level: {
//                     current: 0,
//                     progress: 0,
//                 },
//                 exp: 0,
//                 pp: 0,
//                 history: [],
//                 rank_history: []
//             },
//             m2: {
//                 levels: [
//                     {
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         speed: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         alt: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         jump: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         }
//                     }
//                 ],
//                 global_rank: 0,
//                 country_rank: 0,
//                 notes: {
//                     ssh: 0,
//                     ss: 0,
//                     sh: 0,
//                     s: 0,
//                     a: 0,
//                 },
//                 accuracy: 0,
//                 plays_count: 0,
//                 total_score: 0,
//                 clicks: 0,
//                 combo_max: 0,
//                 music_gender: [],
//                 top_rank: [],
//                 play_time: 0,
//                 level: {
//                     current: 0,
//                     progress: 0,
//                 },
//                 exp: 0,
//                 pp: 0,
//                 history: [],
//                 rank_history: []
//             },
//             m1: {
//                 levels: [
//                     {
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         speed: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         tech: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         alt: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         },
//                         jump: {
//                             s1: 0,
//                             s1: 0,
//                             s3: 0,
//                             s4: 0,
//                             s5: 0,
//                             s6: 0,
//                             s7: 0,
//                             s8: 0,
//                             s9: 0,
//                             s10: 0,
//                         }
//                     }
//                 ],
//                 global_rank: 0,
//                 country_rank: 0,
//                 notes: {
//                     ssh: 0,
//                     ss: 0,
//                     sh: 0,
//                     s: 0,
//                     a: 0,
//                 },
//                 accuracy: 0,
//                 plays_count: 0,
//                 total_score: 0,
//                 clicks: 0,
//                 combo_max: 0,
//                 music_gender: [],
//                 top_rank: [],
//                 play_time: 0,
//                 level: {
//                     current: 0,
//                     progress: 0,
//                 },
//                 exp: 0,
//                 pp: 0,
//                 history: [],
//                 rank_history: []
//             }
//         };
//         var user_infos = {
//                 avatar_url : null,
//                 country : null,
//                 is_bot : null,
//                 is_online : null,
//                 is_supporter : null,
//                 username : null,
//                 has_supported : null,
//                 cover_url : null,
//                 playmode : null,
//                 is_restricted : null,

//         }
//         try {
//             // console.log(query.token)
//             // console.log(query.user_id)
//             const headers = new Headers({
//                 "Authorization": `Bearer ${query.token}`,
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             });
//             let beatmapsIds = []
    
//             const v1_endpoint_base2 = `https://osu.ppy.sh/api/get_user_best?k=${process.env.osuapikey_2}&u=${query.user_id}&type=id&`;
//             const modTypes = ['0', '3', '2', '1'];
//             async function aFetch(mod) {
    
//                 const pms = (mod === '0') ? 'osu' :
//                 (mod === '3') ? 'mania' :
//                 (mod === '1') ? 'fruits' :
//                 (mod === '2') ? 'taiko' :
//                 '?';
//                 const u_best_data = await fetch(v1_endpoint_base2 + `m=${mod}`, { method: 'GET' }).then(response => response.json());
//                 const v2_osu_data = await fetch(`https://osu.ppy.sh/api/v2/users/${query.user_id}/${pms}`, { method: 'GET', headers: headers }).then(response => response.json());
//                 for (const entry of u_best_data) {

//                     osu_stats['m' + mod].top_rank.push(entry);
//                     beatmapsIds.push(entry.beatmap_id)
//                 }
    
//                 osu_stats['m'+mod].global_rank = v2_osu_data.statistics.global_rank;
//                 osu_stats['m'+mod].country_rank = v2_osu_data.statistics.country_rank;
//                 osu_stats['m'+mod].notes.ssh = v2_osu_data.statistics.grade_counts.ssh;
//                 osu_stats['m'+mod].notes.sh = v2_osu_data.statistics.grade_counts.sh;
//                 osu_stats['m'+mod].notes.ss = v2_osu_data.statistics.grade_counts.ss;
//                 osu_stats['m'+mod].notes.s = v2_osu_data.statistics.grade_counts.s;
//                 osu_stats['m'+mod].notes.a = v2_osu_data.statistics.grade_counts.a;
//                 osu_stats['m'+mod].accuracy = v2_osu_data.statistics.hit_accuracy;
//                 osu_stats['m'+mod].plays_count = v2_osu_data.statistics.play_count;
//                 osu_stats['m'+mod].total_score = v2_osu_data.statistics.total_score;
//                 osu_stats['m'+mod].play_time = v2_osu_data.statistics.grade_counts.play_time;
//                 osu_stats['m'+mod].pp = v2_osu_data.statistics.pp;
//                 osu_stats['m'+mod].level.current = v2_osu_data.statistics.level.current;
//                 osu_stats['m'+mod].level.progress = v2_osu_data.statistics.level.progress
//                 osu_stats['m'+mod].combo_max = v2_osu_data.statistics.maximum_combo
//                 osu_stats['m'+mod].clicks = v2_osu_data.statistics.total_hits
//                 osu_stats['m'+mod].ranked_score = v2_osu_data.statistics.ranked_score
//                 osu_stats['m'+mod].history_rank = v2_osu_data.rank_history.data ? v2_osu_data.rank_history.data : []
//                 osu_stats['m'+mod].exp = v2_osu_data.statistics.pp_exp
    
//                 user_infos.avatar_url = v2_osu_data.avatar_url
//                 user_infos.country = v2_osu_data.country.code
//                 user_infos.is_online = v2_osu_data.is_online
//                 user_infos.is_restricted = v2_osu_data.is_restricted
//                 user_infos.is_supporter = v2_osu_data.is_supporter
//                 user_infos.is_bot = v2_osu_data.is_bot
//                 user_infos.has_supported = v2_osu_data.has_supported
//                 user_infos.playmode = v2_osu_data.playmode
//                 user_infos.username = v2_osu_data.username
//                 user_infos.cover_url = v2_osu_data.cover_url
    
//             }
//             const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//             for (const mod of modTypes) {
//                 await aFetch(mod);
//                 await delay(100);
//             }
//             await getBeatmaps(beatmapsIds)
    
//             const allDatas = {
//                 basic_informations : user_infos,
//                 gameplay : osu_stats
//             }
//             const datas = JSON.stringify(allDatas, null, 2);
//             resolve(datas)
//         } catch (error) {
//             console.error('Erreur lors de la requête:', error);
//         }
        
//     })

//     async function getBeatmaps(ids){
//         const foundMaps = [];
//         const notFoundIds = [];

//         for (const id of ids) {
//             const map = await Maps.findOne({
//                 where: {
//                     beatmap_id: id
//                 }
//             });

//             if (map) {
//                 foundMaps.push(map);
//             } else {
//                 notFoundIds.push(id);
//             }

           
//         }
//         console.log('Beatmaps not found:')
//         console.log('Beatmaps founds:')
//             if(notFoundIds.length > 0){
//                 let response = await axios.get(`https://osu.ppy.sh/api/v2/beatmaps`, { params: {'ids[]': notFoundIds},
//                   headers: {
//                       'Content-Type': 'application/json',
//                       'Accept': 'application/json',
//                       'Authorization': `Bearer ${query.token}`
//                 }})
//                 const beatmapsToAdd = response.data.beatmaps;

//                 const mapsData = beatmapsToAdd.map(beatmapData => ({
//                     beatmap_id: beatmapData.id,
//                     beatmapset_id: beatmapData.beatmapset_id,
//                     difficulty_rating: beatmapData.difficulty_rating,
//                     mode: beatmapData.mode,
//                     status: beatmapData.status,
//                     total_length: beatmapData.total_length,
//                     user_id: beatmapData.user_id,
//                     version: beatmapData.version,
//                     accuracy: beatmapData.accuracy,
//                     ar: beatmapData.ar,
//                     bpm: beatmapData.bpm,
//                     convert: beatmapData.convert,
//                     count_circles: beatmapData.count_circles,
//                     count_sliders: beatmapData.count_sliders,
//                     count_spinners: beatmapData.count_spinners,
//                     cs: beatmapData.cs,
//                     deleted_at: beatmapData.deleted_at,
//                     drain: beatmapData.drain,
//                     hit_length: beatmapData.hit_length,
//                     is_scoreable: beatmapData.is_scoreable,
//                     last_updated: beatmapData.last_updated,
//                     mode_int: beatmapData.mode_int,
//                     passcount: beatmapData.passcount,
//                     playcount: beatmapData.playcount,
//                     ranked: beatmapData.ranked,
//                     url: beatmapData.url,
//                     checksum: beatmapData.checksum,
//                     max_combo: beatmapData.max_combo,
//                     artist: beatmapData.beatmapset.artist,
//                     artist_unicode: beatmapData.beatmapset.artist_unicode,
//                     creator: beatmapData.beatmapset.creator,
//                     nsfw: beatmapData.beatmapset.nsfw,
//                     offset: beatmapData.beatmapset.offset,
//                     play_count: beatmapData.beatmapset.play_count,
//                     preview_url: beatmapData.beatmapset.preview_urlpreview_url,
//                     spotlight: beatmapData.beatmapset.spotlight,
//                     status: beatmapData.beatmapset.status,
//                     title: beatmapData.beatmapset.title,
//                     title_unicode: beatmapData.beatmapset.title_unicode,
//                     user_id: beatmapData.beatmapset.user_id,
//                     video: beatmapData.beatmapset.video,
//                     bpm: beatmapData.beatmapset.bpm,
//                     can_be_hyped: beatmapData.beatmapset.can_be_hyped,
//                     is_scoreable: beatmapData.beatmapset.is_scoreable,
//                     ranked_date: beatmapData.beatmapset.ranked_date,
//                     storyboard: beatmapData.beatmapset.storyboard,
//                     submitted_date: beatmapData.beatmapset.submitted_date,
//                     tags: beatmapData.beatmapset.tags

//                 }));
//                 try {
//                     await db_bellafiora.transaction(async (t) => {
//                         await db_bellafiora.query('SET foreign_key_checks = 0', { transaction: t });
//                         await Maps.bulkCreate(mapsData, { transaction: t ,individualHooks: true });
//                         await db_bellafiora.query('SET foreign_key_checks = 1', { transaction: t });
//                     });
//                 }catch(e){
//                     console.log(e)
//                 }
               
//             }

//         }
//     }


module.exports = DataManager