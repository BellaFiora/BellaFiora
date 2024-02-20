async function FetchData(query) {
    return new Promise(async (resolve, reject) => {
        console.log('on fetch')
        var osu_stats = {
            m0: {
                levels: [
                    {
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        speed: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        alt: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        jump: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        }
                    }
                ],
                global_rank: 0,
                country_rank: 0,
                notes: {
                    ssh: 0,
                    ss: 0,
                    sh: 0,
                    s: 0,
                    a: 0,
                },
                accuracy: 0,
                plays_count: 0,
                total_score: 0,
                ranked_score: 0,
                clicks: 0,
                combo_max: 0,
                music_gender: [],
                top_rank: [],
                play_time: 0,
                level: {
                    current: 0,
                    progress: 0,
                },
                exp: 0,
                pp: 0,
                history: [],
                rank_history: []
            },
            m3: {
                levels: [
                    {
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        speed: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        alt: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        jump: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        }
                    }
                ],
                global_rank: 0,
                country_rank: 0,
                notes: {
                    ssh: 0,
                    ss: 0,
                    sh: 0,
                    s: 0,
                    a: 0,
                },
                accuracy: 0,
                plays_count: 0,
                total_score: 0,
                clicks: 0,
                combo_max: 0,
                music_gender: [],
                top_rank: [],
                play_time: 0,
                level: {
                    current: 0,
                    progress: 0,
                },
                exp: 0,
                pp: 0,
                history: [],
                rank_history: []
            },
            m2: {
                levels: [
                    {
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        speed: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        alt: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        jump: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        }
                    }
                ],
                global_rank: 0,
                country_rank: 0,
                notes: {
                    ssh: 0,
                    ss: 0,
                    sh: 0,
                    s: 0,
                    a: 0,
                },
                accuracy: 0,
                plays_count: 0,
                total_score: 0,
                clicks: 0,
                combo_max: 0,
                music_gender: [],
                top_rank: [],
                play_time: 0,
                level: {
                    current: 0,
                    progress: 0,
                },
                exp: 0,
                pp: 0,
                history: [],
                rank_history: []
            },
            m1: {
                levels: [
                    {
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        speed: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        tech: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        alt: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        },
                        jump: {
                            s1: 0,
                            s1: 0,
                            s3: 0,
                            s4: 0,
                            s5: 0,
                            s6: 0,
                            s7: 0,
                            s8: 0,
                            s9: 0,
                            s10: 0,
                        }
                    }
                ],
                global_rank: 0,
                country_rank: 0,
                notes: {
                    ssh: 0,
                    ss: 0,
                    sh: 0,
                    s: 0,
                    a: 0,
                },
                accuracy: 0,
                plays_count: 0,
                total_score: 0,
                clicks: 0,
                combo_max: 0,
                music_gender: [],
                top_rank: [],
                play_time: 0,
                level: {
                    current: 0,
                    progress: 0,
                },
                exp: 0,
                pp: 0,
                history: [],
                rank_history: []
            }
        };
        var user_infos = {
                avatar_url : null,
                country : null,
                is_bot : null,
                is_online : null,
                is_supporter : null,
                username : null,
                has_supported : null,
                cover_url : null,
                playmode : null,
                is_restricted : null,
    
        }
        try {
            // console.log(query.token)
            // console.log(query.user_id)
            const headers = new Headers({
                "Authorization": `Bearer ${query.token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            });
    
            const v1_endpoint_base2 = `https://osu.ppy.sh/api/get_user_best?k=${process.env.osuapikey_2}&u=${query.user_id}&type=id&`;
            const modTypes = ['0', '3', '2', '1'];
            async function aFetch(mod) {
    
                const pms = (mod === '0') ? 'osu' :
                (mod === '3') ? 'mania' :
                (mod === '1') ? 'fruits' :
                (mod === '2') ? 'taiko' :
                '?';
                const u_best_data = await fetch(v1_endpoint_base2 + `m=${mod}`, { method: 'GET' }).then(response => response.json());
                const v2_osu_data = await fetch(`https://osu.ppy.sh/api/v2/users/${query.user_id}/${pms}`, { method: 'GET', headers: headers }).then(response => response.json());
                for (const entry of u_best_data) {
                    osu_stats['m' + mod].top_rank.push(entry);
                }
    
                osu_stats['m'+mod].global_rank = v2_osu_data.statistics.global_rank;
                osu_stats['m'+mod].country_rank = v2_osu_data.statistics.country_rank;
                osu_stats['m'+mod].notes.ssh = v2_osu_data.statistics.grade_counts.ssh;
                osu_stats['m'+mod].notes.sh = v2_osu_data.statistics.grade_counts.sh;
                osu_stats['m'+mod].notes.ss = v2_osu_data.statistics.grade_counts.ss;
                osu_stats['m'+mod].notes.s = v2_osu_data.statistics.grade_counts.s;
                osu_stats['m'+mod].notes.a = v2_osu_data.statistics.grade_counts.a;
                osu_stats['m'+mod].accuracy = v2_osu_data.statistics.hit_accuracy;
                osu_stats['m'+mod].plays_count = v2_osu_data.statistics.play_count;
                osu_stats['m'+mod].total_score = v2_osu_data.statistics.total_score;
                osu_stats['m'+mod].play_time = v2_osu_data.statistics.grade_counts.play_time;
                osu_stats['m'+mod].pp = v2_osu_data.statistics.pp;
                osu_stats['m'+mod].level.current = v2_osu_data.statistics.level.current;
                osu_stats['m'+mod].level.progress = v2_osu_data.statistics.level.progress
                osu_stats['m'+mod].combo_max = v2_osu_data.statistics.maximum_combo
                osu_stats['m'+mod].clicks = v2_osu_data.statistics.total_hits
                osu_stats['m'+mod].ranked_score = v2_osu_data.statistics.ranked_score
                osu_stats['m'+mod].history_rank = v2_osu_data.rank_history.data
                osu_stats['m'+mod].exp = v2_osu_data.statistics.pp_exp
    
                user_infos.avatar_url = v2_osu_data.avatar_url
                user_infos.country = v2_osu_data.country.code
                user_infos.is_online = v2_osu_data.is_online
                user_infos.is_restricted = v2_osu_data.is_restricted
                user_infos.is_supporter = v2_osu_data.is_supporter
                user_infos.is_bot = v2_osu_data.is_bot
                user_infos.has_supported = v2_osu_data.has_supported
                user_infos.playmode = v2_osu_data.playmode
                user_infos.username = v2_osu_data.username
                user_infos.cover_url = v2_osu_data.cover_url
    
            }
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            for (const mod of modTypes) {
                await aFetch(mod);
                await delay(100);
            }
    
            const allDatas = {
                basic_informations : user_infos,
                gameplay : osu_stats
            }
            const datas = JSON.stringify(allDatas, null, 2);
            // console.log(datas)
            resolve(datas)
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
        }
        
    })
   
    
    
}
module.exports = FetchData