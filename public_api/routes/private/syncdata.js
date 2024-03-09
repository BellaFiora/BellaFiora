const db_bellafiora = require('../../src/sequelize');
const { AppMetric, User, Maps } = require('/common/ressources/SequelizeShemas');
const envFile = '/common/env/.env';
const dotenv = require('dotenv');
const { Op } = require('sequelize')
const DataManager = require('../../data_manager')
dotenv.config({ path: envFile });

async function Static(req){
    return new Promise(async (resolve, reject) => {
        const dataManager = new DataManager(req)
        let data = await dataManager.getUser()

        //next
        
        resolve(data)
        // User.findOne({
        //     where: {
        //         user_id: query.user_id
        //     }
        // })
        // .then(async user => {
        //     if (user) {     
        //         let player_data = {
        //             basic_informations: {
        //                 is_online: user.is_online,
        //                 country: user.country,
        //                 username:user.username,
        //                 has_supported: user.has_supported,
        //                 is_supporter: user.is_supporter,
        //                 is_restricted: user.is_restricted,
        //                 playmode: user.playmode,
        //                 is_bot: user.is_bot,
        //                 avatar_url: user.avatar_url,
        //                 cover_url:user.cover_url,
        //             },
        //             gameplay: {
        //                 m0: JSON.parse(user.osu),
        //                 m1: JSON.parse(user.ctb),
        //                 m2: JSON.parse(user.taiko),
        //                 m3: JSON.parse(user.mania),
        //             },
        //             maps : []  
        //         }
        //         let tri = [];
        //         for (let i = 0; i < 4; i++) {
        //             tri.push(player_data.gameplay[`m${i}`]?.top_rank || []);
        //         }         
        //         const ma = [].concat(...tri.map(e => e.map(map => map.beatmap_id)));
        //         try {
        //             const md = await Maps.findAll({
        //                 where: {
        //                     beatmap_id: {
        //                         [Op.or]: ma.map(id => parseInt(id, 10))
        //                     }
        //                   }
        //             });
        //             md.forEach(m => {
        //               const mo = {};
        //               mo[`m${m.beatmap_id}`] = Object.assign({}, m.dataValues);
        //               player_data.maps.push(mo);
        //             });
        //         } catch(e){
        //             console.log(e)
        //         }
        //         resolve(JSON.stringify(player_data))
        //     } else {
        //         await FetchData(query).then(player_data => {
        //             let p_data = JSON.parse(player_data)
        //             let date = new Date()
        //             let user
        //             try {
        //                  user = {
        //                     user_id: query.user_id,
        //                     first_use: date,
        //                     last_use: date,
        //                     last_login: date,
        //                     session_id:query.idApp,
        //                     api_key: 0,
        //                     api_key_sttus: 0,
        //                     api_requests: 0,
                            
        //                     ip: query.ipAddress,
        //                     osu_token:query.osu_token,

        //                     is_online: p_data.basic_informations.is_online,  
        //                     country: p_data.basic_informations.country,
        //                     username: p_data.basic_informations.username,
        //                     has_supported: p_data.basic_informations.has_supported,
        //                     is_supporter: p_data.basic_informations.is_supporter,
        //                     is_restricted: p_data.basic_informations.is_restricted,
        //                     playmode: p_data.basic_informations.playmode,
        //                     is_bot: p_data.basic_informations.is_bot,
        //                     avatar_url: p_data.basic_informations.avatar_url,
        //                     cover_url: p_data.basic_informations.cover_url,

        //                     osu: JSON.stringify(p_data.gameplay.m0 ? p_data.gameplay.m0 : []),
        //                     ctb: JSON.stringify(p_data.gameplay.m1 ? p_data.gameplay.m1 : []),
        //                     taiko: JSON.stringify(p_data.gameplay.m2 ? p_data.gameplay.m2 : []),
        //                     mania: JSON.stringify(p_data.gameplay.m3 ? p_data.gameplay.m3 : []),

        //                 }
        //             } catch(e){
        //                 console.log(e)
        //             }
        //             User.create(user).then(() => {
        //                 resolve(player_data)
        //             }).catch(err => {
        //                 console.log(err)
        //                 resolve(player_data)
        //             })  
        //         })
        //     }
        // }).catch(err => {
           
        // });
    })
}


module.exports = {Static}

// osu_stats.osu.global_rank = v2_osu_data.statistics_rulesets.osu.global_rank
// osu_stats.osu.country_rank = 0
// osu_stats.osu.notes.ssh = v2_osu_data.statistics_rulesets.osu.grade_counts.ssh
// osu_stats.osu.notes.sh = v2_osu_data.statistics_rulesets.osu.grade_counts.sh
// osu_stats.osu.notes.ss = v2_osu_data.statistics_rulesets.osu.grade_count.ss
// osu_stats.osu.notes.s = v2_osu_data.statistics_rulesets.osu.grade_count.s
// osu_stats.osu.notes.a = v2_osu_data.statistics_rulesets.osu.grade_count.a
// osu_stats.osu.accuracy = v2_osu_data.statistics_rulesets.osu.hit_accuracy
// osu_stats.osu.plays_count = v2_osu_data.statistics_rulesets.osu.play_count
// osu_stats.osu.total_score = v2_osu_data.statistics_rulesets.osu.total_score
// osu_stats.osu.combo_max = v2_osu_data.statistics_rulesets.osu.maximum_combo
// osu_stats.osu.pp = v2_osu_data.statistics_rulesets.osu.pp
// osu_stats.osu.exp = v2_osu_data.statistics_rulesets.osu.pp_exp
// osu_stats.osu.level.current = v2_osu_data.statistics_rulesets.osu.level.current
// osu_stats.osu.level.progress = v2_osu_data.statistics_rulesets.osu.level.progress