const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const {spawn} = require('child_process');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const fetch = require('isomorphic-fetch');
const { CredentialsDataManager, IRC } = require('./modules');
const OsuDBReader = require('./db_parser');
const { Beatmap, Osu: { DifficultyCalculator, PerformanceCalculator} } = require('osu-bpdpc')
const osuFiles = require('bmparser')
const request = require('request-promise-native')
const osuutils = require('./osu_utils');
const osuUtils = new osuutils()
const {k, skey} = require('./strict')

let mainWindow;
let clientIP;
let gmIsReady = false;
let BellafioraoAuth2 = "https://techalchemy.fr/oAuth2";
let osuClientId = 28864;
let gmpath;
let appVersion = "1.0.770";
let externalProcess;
let currentSong;
let isEA = false;
let h = false
let attempt = 0
let isOsuLanuched = false
let ScoresIsScanneds = false
let osu_user_id 

app.whenReady().then(async () => {
    let e = app.getAppPath();
    e = e.replace("\\resources\\app.asar", "");
    await LaunchApp()
    await AppVersionCheck()
    await OsuConnexion()
    await StartGosumemory()
    await readOsuFiles()
    await resolveIndexGUI()
    setInterval(async () => {
        try {
            const e = await axios.get("http://127.0.0.1:24050/json");
            const t = e.data;
            if (!t) {
                return
            }

        } catch (j) {
            isOsuLanuched = false
        }
        if (gmIsReady && isOsuLanuched) {
            GosumemorySend();
        }
    }, 1);
    if (externalProcess) {
        externalProcess.stdout.on("data", e => {
            Logs(`stdout: ${e}`, false);
            if (e.includes("Initialized successfully") || e.includes("Initialization complete")) {
                gmIsReady = true;
                isOsuLanuched = true;
                Logs("Gosumemory launched Successfully");

            }
        })

    }
    RunTime()
})
async function AppVersionCheck() {
    return new Promise(async (s, o) => {

        let r;
        const e = {
            family: 4,
            timeout: 4e3
        };
        dns.lookup("www.google.com", e, async e => {
            Logs("Check server status");
            if (e) {
                Logs(`DNS Checkup: ${e}`);
                await StartError("Unable to connect to servers", "You must be connected to the internet to use the application, Connect to the internet and restart ");
                app.quit();
                o(false);
                r = false
            } else {
                r = true;
                try {
                    const t = await axios.get("https://api64.ipify.org?format=json");
                    clientIP = t.data.ip
                } catch (e) {


                    if (attempt < 6) {
                        Logs(`Error retrieving information needed to connect to server, <br> New attempt <br>(${attempt}/5)`);
                        setTimeout(async () => {
                            attempt++
                            await AppVersionCheck()
                        }, 3000);
                        return null
                    } else {
                        Logs(`Unable to retrieve the information needed to connect to the server<br> Error code: 8865<br> Restart Bellafiora or check the documentation`);
                        setTimeout(async () => {
                            await AppVersionCheck()
                        }, 3000);
                        return null
                    }

                }
                const n = new CredentialsDataManager;
                if (!n.getCredentialValue("client_id")) {
                    Logs("When Register in Server");
                    await registerClient()
                    s(true)
                } else {
                    Logs("When Loggin in Server");
                    await loginClient()
                    s(true)
                }
                Logs("When Check update");
            }
        })
    })
}
async function LaunchApp() {
    return new Promise((e, n) => {
        try {
            mainWindow = new BrowserWindow({
                height: 648,
                width: 1133,
                minWidth: 1133,
                minHeight: 648,
                aspectRatio: 1133 / 648,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    paintWhenInitiallyHidden: true
                },
                titleBarStyle: "hidden",
                titleBarOverlay: {
                    color: "#ffffff00",
                    symbolColor: "#a84a89;",
                    height: 30
                },
                show: false
            });
            mainWindow.loadFile("./app/front/loading.html");
            mainWindow.on("closed", () => {
                Logs("UI is Closed");
                e(null)
            });
            mainWindow.once("ready-to-show", () => {
                mainWindow.show();
                Logs("UI is Ready")
                e(true)
            });
            e(mainWindow)
        } catch (e) {
            Logs(`Error in Main: ${e}`);
            n(e)
        }
    })
}
async function Logs(e, show = true) {
    if (mainWindow) {
        if (show) {
            await mainWindow.webContents.send("progress_loading", e)
        }

    }

    const n = new CredentialsDataManager;
    const t = "https://client.bellafiora.fr/client/private/logs";
    const s = {
        checksum: "null"
    };
    const o = {
        idApp: n.getCredentialValue("client_id"),
        ipAddress: clientIP,
        version: "1.0.2",
        logs: e
    };
    try {
        const r = await axios.get(t, {
            params: o
        })
    } catch (e) {
        console.error(e)
    }
}
async function registerClient() {
    return new Promise(async (e, n) => {
        const t = new CredentialsDataManager;
        const s = "abcdefghijklmnopqrstuvwxyz0123456789"
        let o = "";
        for (let e = 0; e < 8; e++) {
            const l = Math.floor(Math.random() * s.length);
            o += s[l]
        }
        const r = "https://client.bellafiora.fr/client/private/register";
        const a = {
            checksum: "null"
        };
        t.setCredentialValue("client_id", o);
        const i = {
            idApp: o,
            ipAddress: clientIP,
            version: appVersion
        };
        try {
            const c = await axios.get(r, {
                params: i
            });

            if (c.data === "done") {
                Logs(`Client is now registered on the server`);
                e(true)
            } else {
                Logs(c.data);
            }
        } catch (e) {
            Logs(`Cannot register the client to the server: ${e}`);
            n(e)
        }
    })
}
async function loginClient() {
    return new Promise(async (e, n) => {
        const t = new CredentialsDataManager;
        const s = "https://client.bellafiora.fr/client/private/login";
        const o = {
            checksum: "null"
        };
        const r = {
            idApp: t.getCredentialValue("client_id"),
            ipAddress: clientIP,
            version: appVersion
        };
        try {
            const a = await axios.get(s, {
                params: r
            });

            if (a.data === "done") {
                Logs(`Client is now connected to the server`);
                e(true)
            } else {
                Logs(a.data);
            }
        } catch (e) {
            console.error("Error when request :", e.message);
            Logs(`Cannot connect the client to the server: : ${e}`);
            n(e)
        }
    })
}
async function osuAuth(e, n) {
    return `https://osu.ppy.sh/oauth/authorize?client_id=${e}&redirect_uri=${encodeURIComponent(BellafioraoAuth2 + "/index.php")}&response_type=code&scope=${n}`
}
async function OsuConnexion() {
    Logs('Login to osu! with oAuth2');
    return new Promise(async (resolve, reject) => {
        try {
            const Credentials = new CredentialsDataManager();
            const isLog = Credentials.getCredentialValue('osu_token')
            isLog ? await checkLocalCredentials() : false;

            if (!isLog) {
                const t = await osuAuth(osuClientId, "identify");
                mainWindow.loadURL(t);
                mainWindow.on("did-finish-load", () => { mainWindow.webContents.executeJavaScript(`document.body.style.overflow = 'hidden';`) });
                mainWindow.webContents.on('did-navigate', async (event, url) => {
                    try {
                        const urlObject = new URL(url);
                        const params = new URLSearchParams(urlObject.search);

                        if (params.has('status')) {
                            if (params.get('status') === 'success') {
                                Credentials.writeCredentialData({ "osu_token": params.get('token') });
                                mainWindow.loadFile('./app/front/loading.html');
                                resolve(true);
                            } else {
                                await OsuConnexion()
                            }
                        }
                    } catch (navigateError) {
                        Logs(`Osu Login Service: Error during navigation - ${navigateError}`);
                        resolve(false);
                    }
                });
            } else {
                resolve(true);
            }
        } catch (error) {
            Logs(`OsuConnexion error: ${error}`);
            resolve(false);
        }

        async function checkLocalCredentials() {
            try {
                Logs('Get osu!token in localefile');
                const Credentials = new CredentialsDataManager();
                const token = Credentials.getCredentialValue('osu_token');

                const apiUrl = `${BellafioraoAuth2}/callback.php?code=${token}`;
                const requestOptions = { method: 'GET' };

                try {
                    Logs('Check osu!token on the server');
                    const response = await fetch(apiUrl, requestOptions);
                    const data = await response.json();
                    return data ? true : false;
                } catch (fetchError) {
                    Logs(`Error during check osu!token: ${fetchError}`);
                    return false;
                }
            } catch (credentialsError) {
                Logs(`Error during get osu!token on localfile (presence.conf) : ${credentialsError}`);
                return false;
            }
        }
    });
}
async function StartGosumemory() {
    Logs("Find Gosumemory");
    return new Promise(async (o, r) => {
        try {

            let e = app.getAppPath();
            e = e.replace("\\resources\\app.asar", "");
            const a = path.join(e, "gosumemory.exe");
            gmpath = a;
            let s;
            fs.access(a, fs.constants.F_OK, e => {
                if (e) {
                    Logs(`Error trying to launch Gosumemory:<br>${e}`);
                    o(false)
                } else {
                    externalProcess = spawn(a);
                    const n = new Promise(n => {
                        if (externalProcess) {
                            externalProcess.stdout.on("data", e => {
                                Logs(`stdout: ${e}`, false);
                                if (e.includes('Checking Updates')) {
                                    isOsuLanuched = true
                                }
                                if (e.includes("Initialized successfully") || e.includes("Initialization complete")) {
                                    gmIsReady = true;

                                    Logs("Gosumemory launched Successfully");
                                    // Logs(isOsuLanuched+gmIsReady)
                                    clearTimeout(s);
                                    n(externalProcess)
                                }
                            })

                        }
                    });
                    const t = new Promise(n => {
                        s = setTimeout(() => {
                            if (!gmIsReady) {
                                if (isOsuLanuched) {
                                    Logs("Launch Osu to get the most out of BellaFiora");
                                    setTimeout(async () => {
                                        o(false)
                                    }, 3000);
                                } else {
                                    Logs("Error When Launching Gosumemory");
                                    o(false)
                                }

                            } else {
                                o(true)
                            }

                        }, 10e3)
                    });
                    Promise.race([n, t]).then(e => {
                        o(e)
                    }).catch(e => {
                        Logs(`Error When Launching Gosumemory<br>${e}`);
                        console.error("Error:", e);
                        o(e)
                    })
                }

            })
        } catch (e) {
            Logs(`Error starting the Gosumemory External process: ${e.message}`);
            o(e)
        }
    })
}

async function readOsuFiles() {
    Logs('Scan Your scores')
    return new Promise(async (res, n) => {
        let scoresdbpath
        let osudbpath
        const c = new CredentialsDataManager;
        const osuDBParser = new OsuDBReader();
        scoresdbpath = c.getCredentialValue('osuScoresPath')
        osudbpath = c.getCredentialValue('osuDbPath')
        if (!scoresdbpath && !osudbpath) {
            Logs("Scan Your scores<br>Thanks for starting Osu! if you launch Bella Fiora for the first time")
            externalProcess.stdout.on("data", async e => {
                if (e.includes("Initialized successfully") || e.includes("Initialization complete") || ScoresIsScanneds) {
                    setTimeout(async () => {
                        try {

                            const e = await axios.get("http://127.0.0.1:24050/json");
                            const t = e.data;
                            scoresdbpath = `${t.settings.folders.game}\\scores.db`;
                            osudbpath = `${t.settings.folders.game}\\osu!.db`;

                            c.setCredentialValue('osuScoresPath', scoresdbpath)
                            c.setCredentialValue('osuDbPath', osudbpath)
                            ScoresIsScanneds = true
                            await retriveScores()
                            res(true)


                        } catch (e) {
                        }
                    }, 5000);
                }
            })

        } else {
            if (!ScoresIsScanneds) {
                await retriveScores()
                res(true)
            }
        }


        async function retriveScores() {
            return new Promise(async (g, m) => {
                try {
                    const result = await new Promise((resolve, reject) => {
                        osuDBParser.readScoresDB(scoresdbpath, (result) => {
                            let e = app.getAppPath();
                            e = e.replace("\\resources\\app.asar", "");
                            outputFilePath = path.join(e, "scores.json");
                            fs.writeFile(outputFilePath, JSON.stringify(result, null, 2), (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
                    });
                    await osuDBParser.readOsuDB(osudbpath, outputFilePath, (beatmap) => { });
                    g(true)
                } catch (e) {
                    g(false)
                }
            })
        }  
    })
}
let isPlaying = false;
let hasDisplayedFinishMessage = false;
let lastMenuState = null;

async function GosumemorySend() {
    try {
        const e = await axios.get("http://127.0.0.1:24050/json");
        const t = e.data;
        const s = [{
            bmid: t.menu.bm.id,
            current: t.menu.bm.time.current,
            total: t.menu.bm.time.mp3
        }];
        if (currentSong == parseInt(t.menu.bm.id)) {
            mainWindow.webContents.send("currentPlay", s)
        } else {
            currentSong = t.menu.bm.id;
            let mapData = await fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${k}&b=${currentSong}`);
                if (!mapData.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${mapData.status}`);
                }
                mapData = await mapData.json()
                bm_status = parseInt(mapData[0].approved)
            try {
                let h = app.getAppPath();
                h = h.replace("\\resources\\app.asar", "");
                outputFilePath = path.join(h, "scores.json");
                const scoresData = fs.readFileSync(outputFilePath, 'utf8');
                scores = JSON.parse(scoresData);
                const matchingBeatmaps = scores[t.menu.bm.md5];
                const scoreContainersHtml = [];
                if (matchingBeatmaps && matchingBeatmaps.length > 0) {
                  const specificBeatmap = matchingBeatmaps[0].beatmap;
                  const matchingScores = matchingBeatmaps.map(score => score);
                  const osuRequests = matchingScores.map(s =>
                    request.get('https://osu.ppy.sh/osu/' + specificBeatmap.beatmapId).then(osu => {
                        let beatmap = Beatmap.fromOsu(osu);
                        let score = {
                            maxcombo: s.maxCombo,
                            count50: s.c50,
                            count100: s.c100,
                            count300: s.c300,
                            countMiss: s.cMiss,
                            countKatu: s.cKetu,
                            countGeki: s.cGeki,
                            perfect: s.perfectCombo,
                            mods: s.mods,
                        };
                        let diffCalc = DifficultyCalculator.use(beatmap).setMods(score.mods).calculate();
                        let perfCalc = PerformanceCalculator.use(diffCalc).calculate(score);
                        let pp
                        let ppValue 
                        if(bm_status === 1){  
                            pp = parseFloat(perfCalc.totalPerformance).toFixed(0)+' PP'
                            ppValue = parseFloat(perfCalc.totalPerformance).toFixed(0)
                        } else if(bm_status === 4) {
                            pp = "Loved"
                            ppValue = parseFloat(perfCalc.totalPerformance).toFixed(0)
                        } else {
                            pp = "Unranked"
                            ppValue = parseFloat(perfCalc.totalPerformance).toFixed(0)
                        }
                        const acc = osuUtils.acc(s.mode,s.c300,s.c100,s.c50,s.cMiss,s.cKatu,s.cGeki)
                        let note = osuUtils.note(s.mode,s.c300,s.c100,s.c50,s.cMiss,s.mods,acc)
                        let greatNote = ""
                        if(note === "SSH"){
                            greatNote = "greatNote"
                            note = "SS"
                        } else if(note === "SH"){
                            greatNote = "greatNote"
                            note = "S"
                        } else {
                            note = note
                        }
                        const scoreContainerHtml = `
                            <div class="score-container">
                                <div class="score-pp">${pp}</div>
                                <div class="score-infos">
                                    <div class="score-container-top"><b>Max Combo:&nbsp;</b>&nbsp;${s.maxCombo}|<b> 
                                    Score:&nbsp;${s.replayScore}</b>&nbsp;|&nbsp;<b>Miss:&nbsp;</b>
                                    &nbsp;${s.cMiss}&nbsp;|&nbsp;<b>300:&nbsp;</b>
                                    &nbsp;${s.c300}&nbsp;|&nbsp;<b>100:&nbsp;</b>&nbsp;${s.c100}&nbsp;|&nbsp;<b>50:&nbsp;</b> ${s.c50}</div>
                                    <div class="score-container-bottom"><b>${ctwtg(s.timestampWindows)}</b>&nbsp;|
                                    &nbsp;<b>&nbsp;&nbsp;${acc}%&nbsp;&nbsp;</b>&nbsp;|&nbsp;
                                    <b>&nbsp;&nbsp;${(parseFloat(diffCalc.starDifficulty)).toFixed(2)} ★</b></div>
                                </div>
                                <div class="score-mods">${s.mods ? EnumsMods(s.mods) : ""}</div>
                                <div class="score-rank ${greatNote}">${note}</div>
                            </div>
                        `;
                        scoreContainersHtml.push({pp : ppValue, html : scoreContainerHtml});
                    })
                  );
              
                  Promise.all(osuRequests).then(() => {
                    const sortedScores = scoreContainersHtml.sort((a, b) => {
                        const ppA = parseInt(a.pp);
                        const ppB = parseInt(b.pp);
                        return ppB - ppA;
                      });
                    mainWindow.webContents.send("resetPlayer", s, t.menu, t, sortedScores,bm_status);
                  });
                }
                mainWindow.webContents.send("resetPlayer", s, t.menu, t, null, bm_status);
            } catch (error) {
                console.error("Une erreur s'est produite lors de la lecture du fichier scores.json :", error);
                return [];
            }
            Logs("resetPlayer", false)
        }
        mainWindow.webContents.send("data", t);
        if (!t.gameplay.hits.hitErrorArray) {
            isPlaying = false
        }
        if (t.menu.state === 2) {
            mainWindow.webContents.send("dataPlaying", t.gameplay, t.menu.bm)
        }
        if (t.menu.state !== lastMenuState) {
            switch (t.menu.state) {
                case 2:
                    if (!isPlaying) {
                        Logs("Start Playing", false);
                        Logs("Initialize graph", false);
                        mainWindow.webContents.send("startPlaying", t.menu.bm);
                        isPlaying = true;
                        hasDisplayedFinishMessage = false
                    }
                    break;
                case 7:
                    if (!isPlaying && !hasDisplayedFinishMessage) {
                        mainWindow.webContents.send("endPlaying", t.resultsScreen);
                        Logs("End Playing", false);
                        Logs("cloturing graph", false);
                        Logs("send datas", false);
                        hasDisplayedFinishMessage = true
                    }
                    isPlaying = false;
                    break;
                case 14:
                    if (!isPlaying && !hasDisplayedFinishMessage) {
                        mainWindow.webContents.send("endPlaying", t.resultsScreen);
                        
                        Logs("End Playing", false);
                        Logs("cloturing graph", false);
                        Logs("send datas", false);
                        hasDisplayedFinishMessage = true
                        await resolveIndexGUI()
                    }
                    isPlaying = false;
                    break;
                default:
                    if (!hasDisplayedFinishMessage && (lastMenuState === 2 && (t.menu.state === 5 || t.menu.state === 12))) {
                        Logs("End Playing (without completing)", false);
                        mainWindow.webContents.send("leftPlaying", null);
                        Logs("cloturing graph", false);
                        hasDisplayedFinishMessage = true
                    } else {
                        hasDisplayedFinishMessage = false
                    }
                    break
            }
            lastMenuState = t.menu.state
        }

    } catch (e) {
        isOsuLanuched = false
        Logs(e, false);
        mainWindow.webContents.send("data", "error")
    }
}
async function RunTime() {



}

async function resolveIndexGUI() {
    return new Promise(async (res, n) => {
        return new Promise(async (b, u) => {
            try {
                const t = new CredentialsDataManager;
                const s = t.getCredentialValue("osu_token");
                const o = `${BellafioraoAuth2}/callback.php?getUser=${s}`;
                const r = {
                    method: "GET"
                };
                const a = await fetch(o, r);
                const i = await a.json();
                osu_user_id = i.id 
                mainWindow.webContents.send("fader", "fadOut");
                setTimeout(() => {
                    mainWindow.loadFile('./app/front/index.html');
                    b(true)
                    
                    setTimeout(async () => {

                        mainWindow.webContents.send("initGUI", i);
                        mainWindow.webContents.send("fader", "fadIn");
                        mainWindow.webContents.send('launchedApp', {client_id: t.getCredentialValue('client_id'), app_version: appVersion})
                        if (!t.getCredentialValue('tp_ids')) {
                            await getTP()
                        } else if (t.getCredentialValue('tp_ids') == toString(JSON.stringify(i.rank_history.data))) {
                            mainWindow.webContents.send('tp_format', t.getCredentialValue('tp_html'))
                        } else {
                            
                            await getTP()
                        }
                        res(true)
                    }, 100);
                }, 500);
                async function getTP() {
                    try {
                        var response = await fetch(`https://osu.ppy.sh/api/get_user_best?k=${k}&u=${i.id}&m=${ModsStringToInt(i.rank_history.mode)}&limit=100`);
                        if (!response.ok) {
                            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                        }
                        var scores = await response.json();
                        const top10Scores = scores.slice(0, 10); 
                        const scorePromises = top10Scores.map(score => {
                            return request.get(`https://osu.ppy.sh/osu/${score.beatmap_id}`).then(osu => {
                                let beatmap = Beatmap.fromOsu(osu);
                                const map = new osuFiles(osu);
                                let diffCalcPlay = DifficultyCalculator.use(beatmap).setMods(parseInt(score.enabled_mods)).calculate();
                                let diffCalcBase = DifficultyCalculator.use(beatmap).setMods(0).calculate();
                                const scoreHTML = `
                                    <div class="score-container">
                                        <div class="score-pp">${(parseFloat(score.pp)).toFixed(0)} PP</div>
                                        <div class="score-infos">
                                            <div class="score-container-top">${map.Title()} - ${map.Artist()} [${map.Version()}] By ${map.Creator()}</div>
                                            <div class="score-container-bottom">${new Date(score.date).toDateString()} | Accuracy: | Stars: ${(parseFloat(diffCalcPlay.starDifficulty)).toFixed(2)}★ ${getStarsDifference(diffCalcPlay.starDifficulty, diffCalcBase.starDifficulty)}</div>
                                        </div>
                                        <div class="score-mods">${EnumsMods(score.enabled_mods)}</div>
                                        <div class="score-rank">${score.rank}</div>
                                    </div>
                                `;
                                function getStarsDifference(playStars, baseStars) {
                                    return playStars !== baseStars ? `(${baseStars.toFixed(2)}★)` : '';
                                }
                                return scoreHTML;
                            });
                        });

                        Promise.all(scorePromises).then(scoreHTMLArray => {
                            const containerHTML = scoreHTMLArray.join("");
                            mainWindow.webContents.send('tp_format', containerHTML);
                            t.setCredentialValue('tp_ids', toString(JSON.stringify(JSON.stringify(i.rank_history.data))));
                            t.setCredentialValue('tp_html', containerHTML);
                        });


                    } catch (error) {
                        console.error('Une erreur s\'est produite lors de la requête:', error.message);
                    }
                }

                getTP()
            } catch (e) {
                console.error("Error:", e);
            }
        })

    })

}

function ModsStringToInt(modeString) {

    switch (modeString.toLowerCase()) {
        case 'osu':
            return 0;
        case 'taiko':
            return 1;
        case 'ctb':
            return 2;
        case 'mania':
            return 3;
        default:
            return -1;
    }
}

function EnumsMods(num) {
    const modNames = [];
    const Mods = {
        NF: 1,
        EZ: 2,
        HD: 8,
        HR: 16,
        SD: 32,
        DT: 64,
        RX: 128,
        HT: 256,
        NC: 512,
        FL: 1024,
        SO: 4096,
        PF: 16384,
        K4: 32768,
        K5: 65536,
        K6: 131072,
        K7: 262144,
        K8: 524288,
        FI: 1048576,
        RD: 2097152,
        TG: 8388608,
        K9: 16777216,
        K1: 67108864,
        K3: 134217728,
        K2: 268435456,
    };

    for (let mod in Mods) {
        if (num & Mods[mod]) {
            modNames.push(mod);
        }
    }
    return modNames.join(" ");
}

function ctwtg(timestampWindows) {
    const epochDiff = 11644473600000;
    const timestampUnix = (timestampWindows / 10000) - epochDiff;
  
    const date = new Date(timestampUnix);
    const adjustedYear = date.getUTCFullYear() - 1600;
    date.setUTCFullYear(adjustedYear);
    return date.toLocaleString();
  }


     
                
            
                
