// require('../../src/components')
// const components__nav = require('../../src/components/nav.js') 
// const components__nav = require('../../src/components/btns.js') 



// const navMenu = components__nav();
// document.body.appendChild(navMenu);

const {ipcRenderer} = require('electron');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts); 




const BPDPC = require('osu-bpdpc');
const earlyAccess = false
if(earlyAccess){

    document.querySelectorAll('.btn-menu').forEach(function (btn) {
        const dataId = btn.getAttribute('data-id');
        console.log(dataId)
        if(dataId === 'HomePage' || dataId === 'RefHelperPage' || dataId === 'DocPage'){
            
        } else {
            btn.classList.add('btn-disable');
        }
            
    });

}

function setActiveButton(button) {
    const dataId = button.getAttribute('data-id');

    // if(earlyAccess){
    //     if(dataId === 'HomePage' || dataId === 'RefHelperPage' || dataId === 'DocPage'){
            if(dataId === "RefHelperPage"){
                const btnMenus = document.querySelectorAll('.btn-menu');
                let oldPage
                btnMenus.forEach(btnMenu => {
                    if (btnMenu.classList.contains('active')) {    
                        const btnMenus = document.querySelectorAll('.btn-menu');
                        btnMenus.forEach(btnMenu => {
                          if (btnMenu.classList.contains('active')) {
                            oldPage = btnMenu.getAttribute('data-id');
                            console.log(oldPage)
                          }
                        });
                        ipcRenderer.send('refHelper-handler', oldPage)
                    }
                });
            // }
            document.querySelectorAll('.main-content').forEach(function (content) {
                content.classList.remove('active');
            });
            
            const mainContent = document.getElementById(dataId);
            mainContent.classList.add('active');
            document.querySelectorAll('.btn-menu').forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            updateIndicatorPosition(button);
        } 
    // } else {
        document.querySelectorAll('.main-content').forEach(function (content) {
                content.classList.remove('active');
        });
        
        const mainContent = document.getElementById(dataId);
        mainContent.classList.add('active');
        document.querySelectorAll('.btn-menu').forEach(function (btn) {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        updateIndicatorPosition(button);
    // }
   
}


ipcRenderer.on('backPage', (event, pageId) => {
    const button = document.querySelector(`[data-id="${pageId}"]`);
    if (button) {
        setActiveButton(button);
    }
})


function updateIndicatorPosition(activeButton) {
    const indicator = document.querySelector('.indicator');
    const activeButtonRect = activeButton.getBoundingClientRect();

    indicator.style.transform = `translateX(${activeButtonRect.left}px)`;
}

function toggleIcon(btn) {
    const icons = btn.querySelectorAll('ion-icon');

    icons.forEach(function (icon) {
        const iconName = icon.getAttribute('name');
        if (btn.classList.contains('active')) {
            if (iconName.endsWith('-outline')) {
                icon.setAttribute('name', iconName.replace('-outline', ''));
            }
        } else {
            if (!iconName.endsWith('-outline')) {
                icon.setAttribute('name', iconName + '-outline');
            }
        }
    });
}

const navBtnActions = document.querySelectorAll('.users-tools .nav-btn-action');
const openBoxEdit = document.querySelector('.open-boxedit');

navBtnActions.forEach(function (navBtnAction) {
    navBtnAction.addEventListener('click', function (event) {
        navBtnActions.forEach(function (otherBtn) {
            if (otherBtn !== navBtnAction) {
                otherBtn.classList.remove('active');
                toggleIcon(otherBtn);
            }
        });
        navBtnAction.classList.toggle('active');
        toggleIcon(navBtnAction);

        const isAnyActive = Array.from(navBtnActions).some(btn => btn.classList.contains('active'));
        openBoxEdit.classList.toggle('reply', !isAnyActive);
    });
});

document.addEventListener('click', function (event) {
    if (!event.target.closest('.users-tools') && !event.target.closest('.nav-btn-action')) {
        navBtnActions.forEach(function (btn) {
            btn.classList.remove('active');
            toggleIcon(btn);
        });
        openBoxEdit.classList.add('reply');
    }
});



var gosumemory = [
        settings = {
        showInterface: true,
        folders: {
        game: "",
        skin: "",
        songs: ""
        }
    },
    menu = {
        mainMenu: {
        bassDensity: 0
        },
        state: 0,
        gameMode: 0,
        isChatEnabled: 0,
        bm: {
        time: {
            firstObj: 0,
            current: 0,
            full: 0,
            mp3: 0
        },
        id: 0,
        set: 0,
        md5: "",
        rankedStatus: 0,
        metadata: {
            artist: "",
            artistOriginal: "",
            title: "",
            titleOriginal: "",
            mapper: "",
            difficulty: ""
        },
        stats: {
            AR: 0,
            CS: 0,
            OD: 0,
            HP: 0,
            SR: 0,
            BPM: {
            min: 0,
            max: 0
            },
            maxCombo: 0,
            fullSR: 0,
            memoryAR: 0,
            memoryCS: 0,
            memoryOD: 0,
            memoryHP: 0
        },
        path: {
            full: "",
            folder: "",
            file: "",
            bg: "",
            audio: ""
        },
        mods: {
            num: 0,
            str: ""
        },
        pp: {
            100: 0,
            99: 0,
            98: 0,
            97: 0,
            96: 0,
            95: 0,
            strains: [0]
        }
        },
        gameplay: {
        gameMode: 0,
        name: "",
        score: 0,
        accuracy: 0,
        combo: {
            current: 0,
            max: 0
        },
        hp: {
            normal: 0,
            smooth: 0
        },
        hits: {
            300: 0,
            geki: 0,
            100: 0,
            katu: 0,
            50: 0,
            0: 0,
            sliderBreaks: 0,
            grade: {
            current: "",
            maxThisPlay: ""
            },
            unstableRate: 0,
            hitErrorArray: null
        },
        pp: {
            current: 0,
            fc: 0,
            maxThisPlay: 0
        },
        keyOverlay: {
            k1: {
            isPressed: false,
            count: 0
            },
            k2: {
            isPressed: false,
            count: 0
            },
            m1: {
            isPressed: false,
            count: 0
            },
            m2: {
            isPressed: false,
            count: 0
            }
        },
        leaderboard: {
            hasLeaderboard: false,
            isVisible: false,
            ourplayer: {
            name: "",
            score: 0,
            combo: 0,
            maxCombo: 0,
            mods: "",
            h300: 0,
            h100: 0,
            h50: 0,
            h0: 0,
            team: 0,
            position: 0,
            isPassing: 0
            },
            slots: null
        }
        },
        resultsScreen: {
        name: "",
        score: 0,
        maxCombo: 0,
        mods: {
            num: 0,
            str: ""
        },
        300: 0,
        geki: 0,
        100: 0,
        katu: 0,
        50: 0,
        0: 0
        },
        tourney: {
        manager: {
            ipcState: 0,
            bestOF: 0,
            teamName: {
            left: "",
            right: ""
            },
            stars: {
            left: 0,
            right: 0
            },
            bools: {
            scoreVisible: false,
            starsVisible: false
            },
            chat: null,
            gameplay: {
            score: {
                left: 0,
                right: 0
            }
            }
        },
        ipcClients: null
        }
    }
]
var playerMusicTotalDuration = 0
var playerMusicCurrentDuration = 0
const musicPlayer = document.getElementById('musicPlayer')

// console.log("bm.bm.id:", bm.bm.id);
    // console.log("bm.bm.artist:", bm.bm.metadata.artist);
    // console.log("bm.bm.difficulty:", bm.bm.metadata.difficulty);
    // console.log("bm.bm.mapper:", bm.bm.metadata.mapper);
    // console.log("bm.bm.title:", bm.bm.metadata.title);
    // console.log("bm.bm.stats.AR:", bm.bm.stats.AR);
    // console.log("bm.bm.stats.CS:", bm.bm.stats.CS);
    // console.log("bm.bm.stats.HP:", bm.bm.stats.HP);
    // console.log("bm.bm.stats.OD:", bm.bm.stats.OD);
    // console.log("bm.bm.stats.SR:", bm.bm.stats.SR);
    // console.log("bm.bm.rankedStatus:", bm.bm.rankedStatus);
    // console.log("bm.bm.gameMode:", bm.gameMode);
    // console.log("bm.bm.mods:", bm.mods.num);

    
const dynamicMusicCurrent = document.getElementById('dynamicMusicCurrent')
ipcRenderer.on('resetPlayer', (event, data, bm, t, scores, bm_status) => {


  if(bm_status === 1){
    document.getElementById('bm_status').innerText = 'RANKED'
  } else if(bm_status === 4){
    document.getElementById('bm_status').innerText = "LOVED"
  } else if(bm_status === 0 || bm_status === -1){
    document.getElementById('bm_status').innerText = "PENDING"
  } else {
    document.getElementById('bm_status').innerText = "GRAVEYARD"
  }


  let background_path = null
  console.log(t)

  console.log(bm.bm.md5)
  if(bm.bm.path.full){
    background_path = `${(t.settings.folders.songs).replace(/\\/g, '/')}/${(bm.bm.path.full).replace(/\\/g, '/')}`
  } else {
    background_path = null
  }


  document.getElementById('specificsMap').innerHTML = "Wait.."
  if(scores){
    document.getElementById('specificsMap').innerHTML = ""
    scores.forEach((score, index) => {
      setTimeout(() => {
        const scoreContainerElement = document.createElement('div');
        scoreContainerElement.innerHTML = score.html;
        document.getElementById('specificsMap').appendChild(scoreContainerElement);
      }, index * 100); 
    });
  }
 


  document.getElementById('musicPlayer').style.background = `url("${background_path}")`

  // document.getElementById('musicPlayer').style.backgroundPositionX = `50%;`

    document.getElementById('music_info_title').innerText = `${bm.bm.metadata.title} - ${bm.bm.metadata.artist}`
    document.getElementById('music_info_diff').innerText = `${bm.bm.metadata.difficulty}`
    document.getElementById('music_info_author').innerText = `Mapped By ${bm.bm.metadata.mapper}`

    let hp = document.getElementById('bm_stats_hp')
    let od = document.getElementById('bm_stats_od')
    let cs = document.getElementById('bm_stats_cs')
    let sr = document.getElementById('bm_stats_sr')
    let ar = document.getElementById('bm_stats_ar')
    let kc = document.getElementById('bm_stats_kc')

    switch(bm.gameMode){
      case 0 :
        document.getElementById('bm_stats_handler_hp').classList.remove('unsued')
        document.getElementById('bm_stats_handler_od').classList.remove('unsued')
        document.getElementById('bm_stats_handler_cs').classList.remove('unsued')
        document.getElementById('bm_stats_handler_sr').classList.remove('unsued')
        document.getElementById('bm_stats_handler_ar').classList.remove('unsued')
        document.getElementById('bm_stats_handler_kc').classList.add('unsued')
        hp.innerText = bm.bm.stats.HP
        od.innerText = bm.bm.stats.OD
        cs.innerText = bm.bm.stats.CS
        ar.innerText = bm.bm.stats.AR
        sr.innerText = bm.bm.stats.SR
        hp.style.width = `${Math.min((bm.bm.stats.HP / 10)*100)}%`
        od.style.width = `${Math.min((bm.bm.stats.OD / 10)*100)}%`
        cs.style.width = `${Math.min((bm.bm.stats.CS / 10)*100)}%`
        ar.style.width = `${Math.min((bm.bm.stats.AR / 10)*100)}%`
        sr.style.width = `${Math.min((bm.bm.stats.SR / 20)*100)}%`
        // kc.innerText = 
        break;
      case 1 :
        document.getElementById('bm_stats_handler_hp').classList.remove('unsued')
        document.getElementById('bm_stats_handler_od').classList.remove('unsued')
        document.getElementById('bm_stats_handler_cs').classList.add('unsued')
        document.getElementById('bm_stats_handler_sr').classList.remove('unsued')
        document.getElementById('bm_stats_handler_ar').classList.add('unsued')
        document.getElementById('bm_stats_handler_kc').classList.add('unsued')
        hp.innerText = bm.bm.stats.HP
        od.innerText = bm.bm.stats.OD
        sr.innerText = bm.bm.stats.SR
        hp.style.width = `${Math.min((bm.bm.stats.HP / 10)*100)}%`
        od.style.width = `${Math.min((bm.bm.stats.OD / 10)*100)}%`
        sr.style.width = `${Math.min((bm.bm.stats.SR / 20)*100)}%`
        break;
      case 2 : 
        document.getElementById('bm_stats_handler_hp').classList.remove('unsued')
        document.getElementById('bm_stats_handler_od').classList.remove('unsued')
        document.getElementById('bm_stats_handler_cs').classList.remove('unsued')
        document.getElementById('bm_stats_handler_sr').classList.remove('unsued')
        document.getElementById('bm_stats_handler_ar').classList.remove('unsued')
        document.getElementById('bm_stats_handler_kc').classList.add('unsued')
        hp.innerText = bm.bm.stats.HP
        od.innerText = bm.bm.stats.OD
        cs.innerText = bm.bm.stats.CS
        ar.innerText = bm.bm.stats.AR
        sr.innerText = bm.bm.stats.SR
        hp.style.width = `${Math.min((bm.bm.stats.HP / 10)*100)}%`
        od.style.width = `${Math.min((bm.bm.stats.OD / 10)*100)}%`
        cs.style.width = `${Math.min((bm.bm.stats.CS / 10)*100)}%`
        ar.style.width = `${Math.min((bm.bm.stats.AR / 10)*100)}%`
        sr.style.width = `${Math.min((bm.bm.stats.SR / 20)*100)}%`
        break;
      case 3 :
        document.getElementById('bm_stats_handler_hp').classList.remove('unsued')
        document.getElementById('bm_stats_handler_od').classList.remove('unsued')
        document.getElementById('bm_stats_handler_cs').classList.add('unsued')
        document.getElementById('bm_stats_handler_sr').classList.remove('unsued')
        document.getElementById('bm_stats_handler_ar').classList.add('unsued')
        document.getElementById('bm_stats_handler_kc').classList.remove('unsued')
        hp.innerText = bm.bm.stats.HP
        od.innerText = bm.bm.stats.OD
        sr.innerText = bm.bm.stats.SR
        hp.style.width = `${Math.min((bm.bm.stats.HP / 10)*100)}%`
        od.style.width = `${Math.min((bm.bm.stats.OD / 10)*100)}%`
        sr.style.width = `${Math.min((bm.bm.stats.SR / 20)*100)}%`
        break;
    }

    // dynamicMusicCurrent.style.width = "0%"
    console.log('resetPlayer')
    musicPlayer.classList.remove('music__player__offline')
    // document.getElementById('total').innerText = data[0].total
 })

 ipcRenderer.on('launchedApp', (event, data)=> {
    console.log(data)
    document.getElementById('software_version').innerText = `v${data.app_version}`
    document.getElementById('application_id').innerText = `client id: ${data.client_id}`
 })
//  ipcRenderer.on('temp', (event, data)=> {
//   console.log(data)

// })
 ipcRenderer.on('currentPlay', (event, data) => {
    // document.getElementById('current').innerText = data[0].current
    // console.log('CurrentPlay')
    // smoothTransitionLinear(data[0].total, data[0].current)
 })

 ipcRenderer.on('fader', (event, fader) => {
  document.body.classList.add(fader)
})

 ipcRenderer.on('initGUI', async (event, data) => {
    
    const defaultMod = data.playmode
    document.getElementById('userAvatar').src = data.avatar_url;
    document.getElementById('welcomeRank').innerText = `Rank: ${data.statistics_rulesets[defaultMod].global_rank} (${data.statistics.rank.country} ${data.country_code})`
    document.getElementById('welcomePP').innerText = `${parseInt(data.statistics_rulesets[defaultMod].pp)} PP`

    document.getElementById('userStat_classedScore').innerText = `${data.statistics.ranked_score}`;
    document.getElementById('userStat_classedPlays').innerText = `${data.statistics.play_count}`;
    document.getElementById('userStat_TotalScore').innerText = `${data.statistics.total_score}`;
    document.getElementById('userStat_Accuracy').innerText = `${(data.statistics.hit_accuracy).toFixed(2)} %`;
    document.getElementById('userStat_nbClick').innerText = `${data.statistics.total_hits}`;
    document.getElementById('userStat_maxCombo').innerText = `${data.statistics.maximum_combo}`

    document.getElementById('userStat_nb_ssh').innerText = `${data.statistics.grade_counts.ssh}`;
    document.getElementById('userStat_nb_ss').innerText = `${data.statistics.grade_counts.ss}`;
    document.getElementById('userStat_nb_sh').innerText = `${data.statistics.grade_counts.sh}`;
    document.getElementById('userStat_nb_s').innerText = `${data.statistics.grade_counts.s}`;
    document.getElementById('userStat_nb_a').innerText = `${data.statistics.grade_counts.a}`;


    rankHistoryUpdate(data.rank_history.data)
  
  


 })

 ipcRenderer.on('tp_format', (event, scoreContainers) => {
    var container = document.getElementById('best_scores');
    container.innerHTML = scoreContainers;

 })
 ipcRenderer.on('userInfos', (event, data) => {

    
    document.getElementById('welcomePseudo').innerText = `Welcome, ${data['username']} !`

    document.getElementById('welcomeGlobalRank').innerText = ``
    document.getElementById('welcomePP').innerText ``
    data.playmode
    data.is_supporter
    data.avatar.url 
  
 })




  

 ipcRenderer.on('gosumemory', (event, data) => {
    
 })

let isPlay = false
let chartPromise

                
let myChart;

ipcRenderer.on('startPlaying', (event, bm) => {
    const container = document.getElementById('playing_keys');
    // document.getElementById('key1').innerHTML = '';
    // document.getElementById('key2').innerHTML = '';
    // document.getElementById('key1').style.width = `${bm.time.full}px`
    // document.getElementById('key2').style.width = `${bm.time.full}px`

    // bm.time.full
    // bm.time.current



    console.log('start playing')
    console.log(bm)
})

ipcRenderer.on('dataPlaying', (event, gameplay, bm) => {
    if (gameplay.keyOverlay.k1.isPressed) {
        let position = bm.time.current
    }
    if (gameplay.keyOverlay.k2.isPressed) {
        let position = bm.time.current
    }
})


ipcRenderer.on('endPlaying', (event, result) => {
    console.log('result')
    console.log(result)
})
ipcRenderer.on('leftPlaying', (event) => {
    console.log('abort playing')
})





ipcRenderer.on('data', (event, gosumemory) => {

    // console.log(gosumemory.gameplay.hits.hitErrorArray)


    // console.log(gosumemory.gameplay.hits.hitErrorArray)
    // console.log(gosumemory.gameplay)

    // console.log(gosumemory)
    
    // ipcRenderer.send('create-custom-titlebar');
    // const musicTitle = document.getElementById('musicTitle')
    // const musicDifficulty = document.getElementById('musicDifficulty')
    // const musicMapper = document.getElementById('musicMapper')
    // const musicCurrentTime = document.getElementById('musicCurrentTime')
    // const musicTotaTime = document.getElementById('musicTotaTime')

    // try {

    //     if(gosumemory === "error"){
    //         if(!musicPlayer.classList.contains('music__player__offline')){
    //             musicPlayer.classList.add('music__player__offline')
    //         }

    //     } else{
            
    //         if(musicPlayer.classList.contains('music__player__offline')){
    //             musicPlayer.classList.remove('music__player__offline')
    //         }
    //         musicTitle.innerText = `${gosumemory.menu.bm.metadata.title} - ${gosumemory.menu.bm.metadata.artist}`
    //         musicDifficulty.innerText = `[${gosumemory.menu.bm.metadata.difficulty}]`
    //         musicMapper.innerText = `Mapped by ${gosumemory.menu.bm.metadata.mapper}`
    //         musicCurrentTime.innerText = msToMinutesSeconds(parseInt(gosumemory.menu.bm.time.current))
    //         musicTotaTime.innerText = msToMinutesSeconds(parseInt(gosumemory.menu.bm.time.full))
    //         // console.log(`${gosumemory.menu.bm.time.current} / ${gosumemory.menu.bm.time.mp3}`)
    //         playerMusicTotalDuration = gosumemory.menu.bm.time.full
    //         playerMusicCurrentDuration = gosumemory.menu.bm.time.current
    //         // dynamicMusicCurrent.style.width = `${calculatePercentage(gosumemory.menu.bm.time.current, gosumemory.menu.bm.time.mp3)}%`;
    
    //         // console.table(gosumemory.gameplay)
    //         // console.log(`Score: ${gosumemory.gameplay.score}`)
    //         // console.log(`Accu: ${gosumemory.gameplay.accuracy}`)
    //         // console.log(`Combo: ${gosumemory.gameplay.combo.current}`)
    //         // console.log(`HP: ${gosumemory.gameplay.hp.normal}`)
    //         // console.log(`Grade: ${gosumemory.gameplay.hits.grade.current}`)
    //         // console.log(`UR: ${gosumemory.gameplay.hits.unstableRate}`)
    //         // console.log(`PP: ${gosumemory.pp.current}`)
    //         // console.log(`Key 1 Count: ${gosumemory.gameplay.keyOverlay.k1.count}`)
    //         // console.log(`Key 2 Count: ${gosumemory.gameplay.keyOverlay.k2.count}`)
    
    //         var k1Pressed = ""
    //         var k2Pressed = ""
    
    //         if(gosumemory.gameplay.keyOverlay.k1.isPressed){
    //             k1Pressed = '(Push)'
    //         } else {
    //             k1Pressed = ""
    //         }
    
    //         if(gosumemory.gameplay.keyOverlay.k2.isPressed){
    //             k2Pressed = '(Push)'
    //         } else {
    //             k2Pressed = ""
    //         }

    //         document.getElementById('beatmapAR').innerText = `AR ${gosumemory.menu.bm.stats.AR}`;
    //         document.getElementById('beatmapCS').innerText = `CS ${gosumemory.menu.bm.stats.CS}`;
    //         document.getElementById('beatmapOD').innerText = `OD ${gosumemory.menu.bm.stats.OD}`;
    //         document.getElementById('beatmapHP').innerText = `HP ${gosumemory.menu.bm.stats.HP}`;
    //         document.getElementById('beatmapSR').innerText = `${gosumemory.menu.bm.stats.fullSR.toFixed(2)} ⭐`;
    //         document.getElementById('beatmapBPM').innerText = `${gosumemory.menu.bm.stats.BPM.min} 🎵`;

    //         if(gosumemory.gameplay.name){
    //             document.getElementById('gameAction').innerText = "Playing"
    //         } else {
    //             document.getElementById('gameAction').innerText = "Listening"
    //         }
    //         // gosumemory.bm.stats.AR
    //         // gosumemory.bm.stats.CS
    //         // gosumemory.bm.stats.OD
    //         // gosumemory.bm.stats.HP
    //         // gosumemory.bm.stats.SR
    //         // gosumemory.bm.stats.bpm.min 
    //         // gosumemory.bm.stats.bpm.max
    //         // gosumemory.bm.path.full 
    //         // gosumemory.bm.path.bg 

    //         // gosumemory.bm.gameplay.
    
    //         // document.getElementById('gameplayScore').innerText = `Score: ${gosumemory.gameplay.score}`
    //         // document.getElementById('gameplayAccuracy').innerText = `Accu: ${gosumemory.gameplay.accuracy}%`
    //         // document.getElementById('gameplayCurrentCombo').innerText = `Combo: ${gosumemory.gameplay.combo.current}`
    //         // document.getElementById('gameplayHpNormal').innerText = `HP: ${gosumemory.gameplay.hp.normal}`
    //         // document.getElementById('gameplayHitsUR').innerText = `UR: ${gosumemory.gameplay.hits.unstableRate}`
    //         // document.getElementById('ppCurrent').innerText = `PP: ${gosumemory.gameplay.pp.current}`
    //         // document.getElementById('gameplayKeyK1Count').innerText = `Key1 : ${gosumemory.gameplay.keyOverlay.k1.count}x ${k1Pressed}`
    //         // document.getElementById('gameplayKeyK2Count').innerText = `Key1 : ${gosumemory.gameplay.keyOverlay.k2.count}x ${k2Pressed}`
    
    
    //         // gameplay__score
    //         // gameplay__accuracy
    //         // gameplay__currentCombo
    //         // gameplay__hpNormal
    //         // gameplay__hitsUR
    //         // pp__current
    //         // gameplay__key_k1Count
    //         // gameplay__key_k2Count
    
    
    //         // console.log(gosumemory.menu.bm.metadata.difficulty)
    //         // console.log(gosumemory.menu.bm.metadata.mapper)
    //     }
       

    // } catch(error){

    // }
 
    // const bmTimeCurrent = gosumemory.menu.bm.time.current;
    // const bmTimeMp3 = gosumemory.menu.bm.time.mp3;
    // const bmId = gosumemory.menu.bm.id;
    // const bmSet = gosumemory.menu.bm.set;
    // const bmArtist = gosumemory.menu.bm.metadata.artist;
    // const bmTitle = gosumemory.menu.bm.metadata.title;
    // const bmMapper = gosumemory.menu.bm.metadata.mapper;
    // const bmDifficulty = gosumemory.menu.bm.metadata.difficulty;

   
});

function msToMinutesSeconds(ms) {
    // console.log(ms)
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  }

function smoothTransitionLinear(totalDuration, currentDuration) {

    const dynamicMusicCurrent = document.getElementById('dynamicMusicCurrent');
    if (totalDuration > 0) {
      dynamicMusicCurrent.style.transition = 'width 0s';
  
      const startTime = Date.now();
      function transitionStep() {
        const elapsed = Date.now() - startTime;
        const stepWidth = (currentDuration / totalDuration) * 100;
        dynamicMusicCurrent.style.width = `${stepWidth}%`;
  
        if (elapsed < totalDuration) {
          requestAnimationFrame(transitionStep);
        } else {
          dynamicMusicCurrent.style.transition = `width ${(totalDuration/100)}ms linear`;
        }
      }
      transitionStep();
    } else {
      dynamicMusicCurrent.style.transition = 'width 0s';
      dynamicMusicCurrent.style.width = '0%';
    }
  }
  
async function rankHistoryUpdate(data){
    function generateDateLabels(numDays) {
        const labels = [];
        for (let i = numDays; i >= 1; i--) {
            labels.push(`${i} day${i > 1 ? 's' : ''} ago`);
        }
        return labels;
    }

    // Nombre de jours
    const numDays = 90;
    const chartOptions = {
        chart: {
          type: 'line',
          events: {
            load: function () {
              this.container.oncontextmenu = function (e) {
                e.preventDefault();
                
              };
              const backgroundElement = document.querySelector('.highcharts-background');
              if (backgroundElement) {
                backgroundElement.style.fill = 'none';
              };
            },
          },
        },
        backgroundColor: null,
        title: {
          text: null,
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
            },
          },
        },
        xAxis: {
          visible: false,
          categories: generateDateLabels(numDays),
          color: '#a84a89'
        },
        yAxis: {
          visible: false,
          reversed: true,
          categories: generateDateLabels(numDays),
          color: '#a84a89'
        },
        series: [
          {
            name: 'Rank',
            data: data,
            color: '#a84a89'
          },
        ],
      };
      Highcharts.chart('rank_highligh', chartOptions);
}

var modBtns = document.querySelectorAll('.mod-btn');
  modBtns.forEach(function (modBtn) {
    modBtn.addEventListener('click', function () {
      if (modBtn.classList.contains('active')) {
        modBtn.classList.remove('active');
        modBtn.querySelector('.cursor').classList.remove('active');
      } else {
        modBtn.classList.add('active');
        modBtn.querySelector('.cursor').classList.add('active');
      }
    });
  });

