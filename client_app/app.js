const { app, BrowserWindow, dialog, ipcMain, shell, Notification, remote, ipcRenderer} = require('electron');
const {spawn} = require('child_process');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const url = require('url');
const http = require('http');
const osuFiles = require('./app/lib/osuFiles')
const AppError = require('./app/lib/error')
const gini = require('./app/lib/ini')
const { Beatmap, Osu: { DifficultyCalculator, PerformanceCalculator} } = require('osu-bpdpc')
const conf = require('credentials')
const OsuDBReader = require('./app/lib/db_parser');
const osuutils = require('./app/lib/osu_utils');
const remoteSrv = require('./app/lib/remoteSrv')
const { Howl, Howler } = require('howler');
const { type } = require('os');

const voiceData = [];
let audioCache = {};
let wsData = null
let mainWindow = null
let isFirstTime = true
let continueExecute = true
let gosumemoryProcess = null
let isOsuLanuched;
let s;
let gmIsReady;
let player_data

app.whenReady().then(async () => {
    const Conf = new conf()
    Conf.setConf('AppPath', app.getAppPath().replace("\\resources\\app.asar", ""))
    fs.readFile(path.resolve(Conf.getConf('AppPath'),'./package.json'), 'utf8', (err, output) => {
        const packageFile = JSON.parse(output)
        Conf.setConf('client_version', packageFile.version)
    })
    ipcMain.on('getMainWindow', () => mainWindow.webContents.send('mainWindow', mainWindow));
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    await LaunchGUI()
    await ServerConnection().then(resp=>{if(resp.err){Log(resp.err, true, true);continueExecute = false}})
    await gLaunch()
    await wsConnect()
    await osuConnect()
    await osuHandler()
    await loadVoices();
    await mainApp()
    await sendCache()  
})
async function osuConnect(){
    Log('Connect your Osu!Account')
    const Conf = new conf()
    if(!continueExecute) return
    return new Promise(async (a, b) => {
        if(Conf.getConf('osu_token')){
            axios.get('https://osu.ppy.sh/api/v2/me', {
                headers: { 'Authorization': `Bearer ${Conf.getConf('osu_token')}`},
            }).then(async response => { 
                console.log(response.data.id)
                if(response.data.id) a(true); 
                await SyncData(); 
            }).catch(error => {console.error('Error fetching data:', error.message);});
        } else {
            console.log('auth service')
            await AuthService()
            await SyncData()
            a(true)
        }
    })
    async function AuthService(){
        return new Promise(async (e, n) => {
            shell.openExternal('https://osu.ppy.sh/oauth/authorize?client_id=30165&redirect_uri=https://techalchemy.fr/oAuth2/Bellafiora/index.php&response_type=code&scope=public identify');
            const server = http.createServer((req, res) => {
                const parsedUrl = url.parse(req.url, true);
                const queryParameters = parsedUrl.query
                axios.get('https://osu.ppy.sh/api/v2/me', { headers: { 'Authorization': `Bearer ${queryParameters.token}`}})
                .then(response => {
                    console.log(queryParameters.token)
                    console.log(response.data.id)
                    if(response.data.id){
                        Conf.setConf('osu_id', response.data.id)
                        Conf.setConf('osu_token', queryParameters.token)
                        const closeWindowScript = '<script>window.close();</script>';
                        res.end(closeWindowScript);
                        setTimeout(() => {server.close()}, 500);
                        e(true)
                    } 
                }).catch(error => {
                    const closeWindowScript = '<script>window.close();</script>';
                    res.end(closeWindowScript);
                    server.close()
                });
            });
            server.listen(3000, '127.0.0.1',)
        })
    }
    async function SyncData() {
        return new Promise(async (resolve, reject) => {
            try {
                axios.get('http://176.145.161.240:25586/client/private/syncdata', {
                    params: {
                        setter: 'set',
                        client_id: Conf.getConf('client_id'),
                        token: Conf.getConf('osu_token'),
                        user_id: Conf.getConf('osu_id')
                    }
                }).then(response => {

                    if (response.status === 200) {
                        player_data = response.data
                        console.log(typeof(player_data))
                        resolve(true);

                    } else {
                        reject(new Error(`HTTP request failed with status: ${response.status}`));
                    }
                })
    
            } catch (error) {
                console.error('Error making HTTP request:', error);
                reject(error);
            }
        });
    }
}
async function mainApp(){
    if(!continueExecute) return
    return new Promise((e, n) => {
        mainWindow.loadURL(
            url.format({
                pathname: path.join('./app/front/gui.html'),
                protocol: 'file:',
                slashes: true,
            })
        )
        e(true)
    })
    
}
async function LaunchGUI(){
    if(!continueExecute) return
    const Conf = new conf()
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
                e(null)
            });
            mainWindow.once("ready-to-show", () => {
                // mainWindow.webContents.openDevTools();
                mainWindow.show();
                let a = {
                    client_version: Conf.getConf('client_version'),
                    client_ip: Conf.getConf('client_ip'),
                    client_id: Conf.getConf('client_id')
                }
                mainWindow.webContents.send('client_informations', a)
                Conf.setConf('app', mainWindow)
                e(mainWindow)
            });
            e(mainWindow)
        } catch (e){n(e)}
    })
}
async function ServerConnection(){
    if(!continueExecute) return
    const Conf = new conf()
    const RemoteSrv = new remoteSrv()
    const t = await axios.get("https://api64.ipify.org?format=json");
    Conf.setConf('client_ip', t.data.ip)
    return new Promise(async (e, n) => {
        if(Conf.getConf('client_id')){
            Log('Server Synchronisation..')
            RemoteSrv.Login(mainWindow).then(r=>{e({stat: r.stat, err: r.err})})
        } else {
            Log('Server Register')
            RemoteSrv.Reg(mainWindow).then(r=>{e({stat: r.stat, err: r.err}) })
        }
    })
}
async function Log(e, show = true, err = false, toServ= true) {
    const RemoteSrv = new remoteSrv()
    if (show) {
        if(err){
            try { await mainWindow.webContents.send("loading_err", e)} 
            catch(e){ console.log(e)}
        } else {
            try {await mainWindow.webContents.send("progress_loading", e)}
            catch(e){console.log(e) }
        }
    }
    console.log(e)
    if(toServ) RemoteSrv.Log(e);
}
async function gLaunch(){
    if(!continueExecute) return
    Log('Starting Gosumemory')
    return new Promise(async (o, r) => {
        try {
            const Conf = new conf();
            fs.access(path.join(Conf.getConf('AppPath'), "gosumemory.exe"), fs.constants.F_OK, e => {
                if (e) {Log(`Error trying to launch Gosumemory:<br>${e}`); o(false)} 
                else {
                    externalProcess = spawn(path.join(Conf.getConf('AppPath'), "gosumemory.exe"));
                    const n = new Promise(n => {
                        if (externalProcess) {
                            externalProcess.stdout.on("data", async e => {
                                Log(`stdout: ${e}`, false);
                                if (e.includes('Checking Updates')) isOsuLanuched = true;
                                if (e.includes("Initialized successfully") || e.includes("Initialization complete")) {
                                    gmIsReady = true;  
                                    clearTimeout(s);
                                    const gIni = new gini()
                                    gosumemoryProcess = externalProcess
                                    gIni.set('Main', 'update',1)
                                    n(externalProcess)
                                }
                            })

                        }
                    });
                    const t = new Promise(n => {
                        s = setTimeout(() => {
                            if (!gmIsReady) {
                                if (isOsuLanuched) {
                                    Log("If this is the first time, start Osu!", true, true);
                                    setTimeout(async () => {
                                        o(false)
                                        isOsuLanuched = false
                                    }, 3000);
                                } else { Log("Error When Launching Gosumemory", true, true); o(false)}
                            } else {o(true)}
                        }, 10e3)
                    });
                    Promise.race([n, t]).then(e => {o(e)}).
                    catch(e => {
                        Log("Error When Launching Gosumemory", true, true);
                        isOsuLanuched = false
                        o(e)
                    })
                }

            })
        } catch(e){Log(`Error When Launching Gosumemory: ${e.message}`, true, true); o(e)}
    })
}
async function wsConnect(){
    if(!continueExecute) return
    const Conf = new conf()
    Log('Connection to the Websocket')
    mainWindow.webContents.send('ws_connect', true);
    return new Promise((resolve) => {
        ipcMain.on('ws_connect_result', (event, arg) => {
            if(arg){
                Log(arg, true, true)
                continueExecute = false
                // resolve(arg);
            } 
            else {resolve(true) }
        });
        ipcMain.on('ws_osu_path', (event, arg) => { Conf.setConf('osu_path', arg)})
      });

}
async function osuHandler(){
    if(!continueExecute) return
    return new Promise(async (o, r) => {
        const OsuFiles = new osuFiles()
        const Conf = new conf();
        if(fs.existsSync(path.join(Conf.getConf('AppPath'), '/beatmaps.json'))){
            Log('Update your Scores', true, false)
            OsuFiles.updateScores(mainWindow).then(()=> {o(true)})
        } else {
            Log('Scan your beatmaps', true, false)
            OsuFiles.osuDbParse(mainWindow).then(()=> {
                Log('Scan your scores', true, false)  
                OsuFiles.scoreDbParse(mainWindow).then(()=> {
                    OsuFiles.updateScores(mainWindow).then(()=> {o(true)})
                })
            })
        }
    })
}
async function loadVoices() {
    if(!continueExecute) return
    Log('Load Voices Assets', true, false);
    return new Promise((resolve, reject) => {
        const languages = ['FR'];
        const types = ['ur', 'aim', 'tolate', 'toquickly'];
        const Conf = new conf();
        try{
            languages.forEach(language => {
                types.forEach(type => {
                    for (let i = 1; i <= 7; i++) {
                        const fileName = `0${i}.wav`;
                        const filePath = path.join(Conf.getConf('AppPath'), 'app', 'src', 'assets', 'voices', language, type, fileName);
                        if (!audioCache[filePath]) {
                                const data = fs.readFileSync(filePath);
                                audioCache[filePath] = data;
                                voiceData.push({ language, type, buffer: new Uint8Array(data)});      
                        }
                    }
                });
            });
        } catch(e){AppError(mainWindow, 'Audios Assets Not Found')}
        if (voiceData.length > 0) {resolve(voiceData);}
    });
}
async function sendCache(){
    if(!continueExecute) return
    return new Promise((e, n) => { setTimeout(async () => {
        mainWindow.webContents.send('audio-cache', voiceData);  
        mainWindow.webContents.send('player-data', player_data);
        console.log('send')
        e(true)
    }, 1000);})
}