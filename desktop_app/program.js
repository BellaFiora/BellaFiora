const { app, BrowserWindow, dialog, ipcMain, shell, Notification, globalShortcut } = require('electron');
const { autoUpdater } = require('electron-updater');
const { spawn, execSync } = require('child_process');
const axios = require('axios');
const vm = require('vm');
const util = require('util');
const fs = require('fs');
const path = require('path');
const url = require('url');
const http = require('http');
const readFile = util.promisify(fs.readFile);

// *** App Libs *** // 
const { AppError, PluginError } = require('./app/lib/Errors')
const remoteSrv = require('./app/lib/priv/remote-server')
const conf = require('./app/lib/priv/credentials');
// const LocalServer = require('./app/lib/Servers');
// const Artisan = require('./app/lib/Web_Builder')
const Settings = require('./app/lib/Settings')
const {Files} = require('./app/lib/Files')
const {OsuParse} = require('./app/lib/Parsers')
const { GenerateUID} = require('./app/lib/Utils')

const packageJson = require('./package.json');
const OsuDBReader = require('./app/lib/Readers');


let mainWindow = {}
let continueExecute = true
let isOsuLanuched = false
let tsIsReady = false
let player_data = {}
var isLimitedMod = false
let translations = {};
let dictionnary = null
let pluginLogs = {}
let isFirstTime = true;
// let isDev = process.env.dev || false;
let isDev = false
let client_id = null
let collections


const AppData = path.join(process.env.LOCALAPPDATA, 'Bella Fiora Desktop');
if (!fs.existsSync(AppData)){fs.mkdirSync(AppData, { recursive: true })} 

const Conf = new conf();
const File = new Files()
const RemoteSrv = new remoteSrv();

Conf.setConf('client_version', packageJson.version);
Conf.setConf('AppPath', app.getAppPath().replace("\\resources\\app.asar", ""));
Conf.setConf('LocalPath', AppData);


app.whenReady().then(async () => {
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required'); 
    globalShortcut.register('F11', () => {})

    if (process.platform === "win32") { execSync('chcp 65001 > nul')};
    if (!Conf.getConf('AlreadyInstalled')){isFirstTime = false};
    isFirstTime = false
   
    if(!Conf.getConf('client_id') && isFirstTime){ client_id = GenerateUID()}
 
    await checkLocalApp()
    await loadTranslation(null, ipcMain)
    await LaunchLoading();
    // await checkingUpdate()

    await ServerConnection()
    await tLaunch(isFirstTime).then(async (stat)=> {
        await wsConnect(stat);
    })
   
    // await osuConnect();
    await osuHandler(collections);
    await LaunchGUI();
    await sendCache();
    ipcMain.on('getLang', async (event, lang) => { mainWindow.webContents.send('lang', lang ? await loadTranslation(lang) : dictionnary)});

    // Declaring API endpoints for external plugins
    // const pluginAPI = {
    //     //Initalisation and creation of the user interface 
    //     OpenLog: () => {
    //         createLogPluginWindow()
    //     },
    //     Tab: (obj) => { },
    //     //Error monitoring and management
    //     Log: (log) => {
    //         try {
    //             throw new Error();
    //         } catch (error) {
    //             const c = error.stack.split('\n')[2].trim();
    //             const pi = c.substring(c.indexOf("plugin") + "plugin".length + 1, c.indexOf("\\", c.indexOf("plugin") + "plugin".length + 1));
    //             const j = require(`./plugin/${pi}/plugin.json`)
    //             if (pluginLogs) {
    //                 pluginLogs.webContents.send('log', `<b>${j.name}</b>:  ${log}`)
    //             }

    //         }
    //     },
    //     FatalError: (fatalError) => {
    //         PluginError(mainWindow, fatalError, true)
    //     },
    //     Error: (error, exit = false) => {
    //         PluginError(mainWindow, error, exit)
    //     },

    //     //Get Objetcts
    //     PlayerData: async () => { }, //Return an object
    //     Osu: async () => { }, //Return an object

    //     //GetFile
    //     LoadFile: async (filePath) => {
    //         return new Promise((resolve, reject) => {
    //             let pi
    //             try {
    //                 throw new Error();
    //             } catch (error) {
    //                 const c = error.stack.split('\n')[2].trim();
    //                 pi = c.substring(c.indexOf("plugin") + "plugin".length + 1, c.indexOf("\\", c.indexOf("plugin") + "plugin".length + 1));
    //             }


    //             fs.readFile(`${Conf.getConf('AppPath')}/plugin/${pi}/${filePath}`, 'utf8', (err, file) => {
    //                 if (err) {
    //                     PluginError(mainWindow, `Cannot load file <b>${file}</b>`)
    //                 } else {
    //                     resolve(file)
    //                 }
    //             });
    //         })
    //     },
    //     WebRequest: async (url, method, headers = {}, data = null) => {
    //         return new Promise((resolve, reject) => {
    //             const requestConfig = {
    //                 method: method,
    //                 url: url,
    //                 headers: headers,
    //                 data: data,
    //             };
    //             axios(requestConfig).then(response => {
    //                 resolve(response);
    //             }).catch(error => {
    //                 resolve(error);
    //             });
    //         });
    //     },
    //     Renderer: (eventName, data = null) => {
    //         mainWindow.webContents.send(eventName, data)
    //     }
    // }
    // await loadPlugin(pluginAPI)

})

async function osuConnect() {
    if (!continueExecute) return
    if (isLimitedMod) return
    // Log message for connecting Osu!Account
    Log(tr('Connect your Osu!Account'));

    // Create a new configuration object
    const Conf = new conf();
    // Return a Promise
    return new Promise(async (resolve, reject) => {
        // Check if Osu token exists in configuration
        if (Conf.getConf('osu_token')) {

            RemoteSrv.checkToken(Conf.getConf('osu_token'), Conf.getConf('client_id')).then(resp => {
                if(!resp.isValide){
                    AuthService().then(result => {
                        // console.log(result)
                        // await SyncData();
                        resolve()
                    })
                }
            })
            // // Make a GET request to Osu! API to fetch user data
            // axios.get('https://osu.ppy.sh/api/v2/me', {
            //     headers: { 'Authorization': `Bearer ${Conf.getConf('osu_token')}` },
            // }).then(async response => {
    

            //     // Resolve if user ID exists in the response
            //     if (response.data.id)
            //         // Call SyncData function
            //         Log(tr('Data Synchronization'))

            //     await SyncData();
            //     resolve(true);
            // }).catch(error => {

            //     console.error('Error fetching data:', error.message);
            //     reject(error);
            // });
           
        } else {
            // If Osu token doesn't exist, perform authentication and sync data
            await AuthService();
            Log(tr('Data Synchronization'))
            await SyncData();
            resolve(true);
        };
    });

    // Authentication function for Osu
    async function AuthService() {
        return new Promise(async (resolve, reject) => {
            // Open external URL for Osu! OAuth authorization
            shell.openExternal('https://osu.ppy.sh/oauth/authorize?client_id=30165&redirect_uri=https://techalchemy.fr/oAuth2/Bellafiora/index.php&response_type=code&scope=public identify');
            let osuConnectError = setTimeout(() => {
                Log('Vous devez vous connecter sur Osu! Pour continuer',true, true)
            }, 5000);
            // Create a server for handling the authorization callback
            const server = http.createServer((req, res) => {
                const parsedUrl = url.parse(req.url, true);
                const queryParameters = parsedUrl.query;
                if(queryParameters.error){
                    Log('Vous devez vous connecter sur Osu! Pour continuer',true, true)
                    mainWindow.webContents.send('osuError', tr('Connect your Osu!Account')); 
                    server.close();
                } else {
                    clearTimeout(osuConnectError)
                    axios.get('https://osu.ppy.sh/api/v2/me', { headers: { 'Authorization': `Bearer ${queryParameters.token}` } })
                    .then(response => {
                        // Resolve if user ID exists in the response
                        if (response.data.id) {
                            // Save Osu ID and token in configuration
                            Conf.setConf('osu_id', response.data.id);
                            Conf.setConf('osu_token', queryParameters.token);
                            Conf.setConf('refresh_token', queryParameters.refresh_token);

                            // Close the authorization window
                            res.writeHead(200, { 'content-Type': 'text/html' })
                            res.write(`
                            <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Bella Fiora Desktop - Auth Service</title>
                                    <style>
                                        * {
                                            margin:0;
                                            padding:0;
                                            box-sizing: border-box;
                                            font-family:Verdana, Geneva, Tahoma, sans-serif ;
                                        }
                                        :root {
                                            --background5: rgba(255, 0, 0, 0.151);
                                        }
                                        body {
                                            background:linear-gradient(263deg, var(--background5) 18%, rgb(236, 236, 236) 63%);
                                        }
                                        .root {
                                            width: 100vw;
                                            height: 100vh;
                                            display: flex;
                                            flex-direction: column;
                                            justify-content:space-between;
                                            align-items: center;
                                        }
                                        .title {
                                            height: 150px;
                                            font-size: 45px;
                                            display: flex;
                                            align-items: end;
                                        }
                                        .message {
                                            height: 120px;
                                            font-size: 22px;
                                        }
                                        .v_software {
                                            height: 20px;
                                        }
                                    </style>
                                </head>
                                <body>
                                <div class="root">
                                    <h1 class="title">${tr('Osu! Authorization granted !')}</h1>
                                    <p class="message">${tr('You can return to Bella Fiora Desktop')}</p>
                                    <p>${tr('If this page has not closed automatically, you can do it yourself')}</p>
                                    <p class="v_software">v 0.1.932</p> 
                                </div>
                                </body>
                                <script>setTimeout(()=> {window.close()}, 5000)
                                </html>`);
                            const closeWindowScript = '';
                            res.end(closeWindowScript);
                            // res.end(closeWindowScript);
                            setTimeout(() => { server.close(); }, 500);
                            resolve(true);
                        } else {
                            console.log(response)
                        }

                     
                    }).catch(error => {
                        // Close the authorization window in case of error
                        const closeWindowScript = '<script>window.close();</script>';
                        res.end(closeWindowScript);
                        server.close();
                        resolve(false)
                    });

                }

                // Make a GET request to Osu! API with the received token
            });

            // Start the server on localhost:3000
            server.listen(3000, '127.0.0.1');
        });
    };

    // Function to synchronize data
    async function SyncData() {
        const Conf = new conf();
        

        return new Promise(async (resolve, reject) => {
            try {
                // Make a GET request to a server for data synchronization
                await RemoteSrv.sync(Conf.getConf('client_id'), Conf.getConf('osu_token'), Conf.getConf('osu_id')).then(resp => {

                    if (!resp) {
                        Log(tr('Unauthorised on the server'), true, true)
                        continueExecute = false
                    } else {
                        player_data = JSON.parse(resp)
                    }
                    resolve(true)
                })
            } catch (error) {
                console.error('Error making HTTP request:', error);
                reject(error);
            };
        });
    };
};
async function LaunchLoading() {
    // Check if execution should continue
    if (!continueExecute) return

    const Conf = new conf();

    return new Promise((resolve, reject) => {
        try {
            // Create a new BrowserWindow for the GUI
            mainWindow = new BrowserWindow({
                height: 700,
                width: 1400,
                minWidth: 1400,
                minHeight: 700,
                aspectRatio: 1400 / 700,
                transparent: true,
                resizable: false,
                fullScreenable: false,
                maximizable: false,
                fullScreen: false,
                // paintWhenInitiallyHidden: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    paintWhenInitiallyHidden: true
                },
                titleBarStyle: "hidden",
                titleBarOverlay: {
                    color: "#ffffff00",
                    symbolColor: "white",
                    height: 30
                },
                show: false
            });

            mainWindow.loadFile("./app/front/loading.html");

            // Event listener for when the window is closed
            mainWindow.on("closed", () => {
                resolve(null);
            });

            // Event listener for when the window is ready to show
            mainWindow.once("ready-to-show", () => {
                // Uncomment the line below to open DevTools
                // mainWindow.webContents.openDevTools();

                // Show the main window
                mainWindow.show();
                mainWindow.paintWhenInitiallyHidden = false

                let clientInfo = {
                    client_version: Conf.getConf('client_version'),
                    client_ip: Conf.getConf('client_ip'),
                    client_id: Conf.getConf('client_id')
                };

                mainWindow.webContents.send('client_informations', clientInfo);

                // Save the mainWindow reference in configuration
                Conf.setConf('app', mainWindow);
                resolve(mainWindow);

                // Send client information to the window

            });

            // Resolve with the mainWindow reference
            resolve(mainWindow);
        } catch (error) {
            // Reject if there's an error
            continueExecute = false
            reject(error);
        };
    });
};
async function LaunchGUI() {
    let Conf = new conf()
    if (!continueExecute) return
    return new Promise(async (e, n) => {
        // const rawHTML_1 = fs.readFileSync(path.join(Conf.getConf('AppPath'), 'app/src/html/body_p1.raw'), 'utf-8');
        // const rawHTML_2 = fs.readFileSync(path.join(Conf.getConf('AppPath'), 'app/src/html/body_p2.raw'), 'utf-8');

        // const artisan = new Artisan();
        // let default_mode = player_data.basic_informations.playmode
        // console.log(default_mode)
        // let dm = (default_mode === 'osu') ? 'm0' :
        //             (default_mode === 'mania') ? 'm3' :
        //             (default_mode === 'taiko') ? 'm1' :
        //             (default_mode === 'fruits') ? 'm2' : 'm0';
        // let gameplay = player_data.gameplay[dm]
        // let data = {}
        // let placeholder = '<span class="loading_holder t100p h90 left right">'
        // if(isLimitedMod){
        //     data = {
        //         windowTitle: 'Bella Fiora Desktop',
        //         username: player_data.basic_informations.username,
        //         accuracy: parseFloat(gameplay.accuracy).toFixed(2),
        //         playcount: gameplay.plays_count,
        //         total_score: gameplay.total_score,
        //         maxCombo:gameplay.combo_max,
        //         ssh:gameplay.notes.ssh,
        //         ss:gameplay.notes.ss,
        //         sh:gameplay.notes.sh,
        //         s:gameplay.notes.s,
        //         a:gameplay.notes.a,
        //         global_rank:gameplay.global_rank,
        //         country_rank:gameplay.country_rank,
        //         clicks:gameplay.clicks,
        //         pp:parseFloat(gameplay.pp).toFixed(2),
        //         avatar_url:player_data.basic_informations.avatar_url,
        //         country:player_data.basic_informations.country,

        //     }
        // } else {
        //     data = {
        //         windowTitle: 'Bella Fiora Desktop',
        //         username: player_data.basic_informations.username,
        //         accuracy: parseFloat(gameplay.accuracy).toFixed(2),
        //         playcount: gameplay.plays_count,
        //         total_score: gameplay.total_score,
        //         maxCombo:gameplay.combo_max,
        //         ssh:gameplay.notes.ssh,
        //         ss:gameplay.notes.ss,
        //         sh:gameplay.notes.sh,
        //         s:gameplay.notes.s,
        //         a:gameplay.notes.a,
        //         global_rank:gameplay.global_rank,
        //         country_rank:gameplay.country_rank,
        //         clicks:gameplay.clicks,
        //         pp:parseFloat(gameplay.pp).toFixed(2),
        //         avatar_url:player_data.basic_informations.avatar_url,
        //         country:player_data.basic_informations.country,

        //     }
        // }

        // const mo = {};
        // for (const mapEntry of player_data.maps) {
        //     const beatmapKey = Object.keys(mapEntry)[0];
        //     const beatmapData = mapEntry[beatmapKey];
        //     mo[beatmapData.beatmap_id] = beatmapData;
        //   }
        //   let scoreHTML = []

        // for (let i = 0; i < 10; i++) {
        //     scoreHTML.push(artisan.scoreElement(player_data.gameplay.m0.top_rank[i], mo[player_data.gameplay.m0.top_rank[i].beatmap_id],default_mode))
        // }
        // for (let i = 0; i < 10; i++) {
        //     scoreHTML.push(artisan.scoreElement(player_data.gameplay.m1.top_rank[i], mo[player_data.gameplay.m1.top_rank[i].beatmap_id],default_mode))
        // }
        // for (let i = 0; i < 10; i++) {
        //     scoreHTML.push(artisan.scoreElement(player_data.gameplay.m2.top_rank[i], mo[player_data.gameplay.m2.top_rank[i].beatmap_id],default_mode))
        // }
        // for (let i = 0; i < 10; i++) {
        //     scoreHTML.push(artisan.scoreElement(player_data.gameplay.m3.top_rank[i], mo[player_data.gameplay.m3.top_rank[i].beatmap_id],default_mode))
        // }
        // artisan.create({
        //     props: {
        //         // lang: (player_data.basic_informations.country).toLowerCase(),
        //         lang: 'en',
        //         objectType: 'document',
        //         format: 'html',
        //         charset: 'UTF-8', 
        //         viewPort: 'width=device-width, initial-scale=1.0',
        //         ressources: {
        //           css: ["../src/style.css", "https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/2.3.2/rangeslider.css"],
        //           scripts: [
        //             {
        //               href: '../renderers/gui_renderer.js',
        //               defer: true,
        //               position: 'endBody'
        //             }, 
        //             {
        //               href: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
        //               position: 'Header',
        //               type: 'module'
        //             }, {
        //                 href: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js',
        //                 position: 'Header',
        //                 nomodule: true
        //             }
        //           ], 
        //           links: [
        //             {
        //               href: 'https://fonts.googleapis.com',
        //               rel: 'preconnect',
        //               position: 'Header'
        //             }, {
        //               href: 'https://fonts.gstatic.com',
        //               rel: 'preconnect',
        //               position: 'Header',
        //               cross : "crossorigin"
        //             }, {
        //               href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap',
        //               rel: 'stylesheet',
        //               position: 'Header'
        //             }, {
        //               href: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
        //               rel: 'stylesheet',
        //               position: 'Header'
        //             }, {
        //               href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300&display=swap',
        //               rel: 'stylesheet',
        //               position: 'Header'
        //             }, {
        //               href: 'https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/2.3.2/rangeslider.css',
        //               rel: 'stylesheet',
        //               position: 'Header'
        //             },
        //           ]
        //         }
        //     }
        // })
        // .addContentHTML(rawHTML_1, data)
        // .addContentHTML(scoreHTML.toString().replace(/,/g, ''))
        // .addContentHTML(rawHTML_2, data)
        // .construct().then(r=>{
        //     const tempHTMLPath = path.join(Conf.getConf('AppPath'),'app/front/gui2.html');
        //     fs.writeFile(tempHTMLPath, r, (writeErr) => {
        //         if (writeErr) {
        //             console.error('Erreur lors de l\'écriture du fichier temporaire:', writeErr);
        //             return;
        //         }
        //         mainWindow.loadFile("app/front/gui2.html");
        //         e(true);
        //     });  
        // });
        // e(true)

        mainWindow.loadFile("app/front/gui.html");
        e(true);
    });
};
async function ServerConnection() {
    // Check if execution should continue
    if (!continueExecute) return

    // Create new configuration and remote server objects
    const Conf = new conf();
    const RemoteSrv = new remoteSrv();

    // Fetch the client's IP address using an external API
    try {
        ipResponse = await axios.get("https://api64.ipify.org?format=json");
        Conf.setConf('client_ip', ipResponse.data.ip);
    } catch (e) {
        AppError(mainWindow, tr('Please Enable Internet Connection'));
        continueExecute = false;
        return
    };

    return new Promise(async (resolve, reject) => {

        if(!Conf.getConf('AlreadyInstalled')){ 
            Log(tr('Server Register'));
            RemoteSrv.Reg(client_id).then(result => {
                resolve({ stat: result.stat, err: result.err });
            });
        } else {
            Log(tr('Server Synchronization..'));
            RemoteSrv.Login(client_id).then(result => {
                resolve({ stat: result.stat, err: result.err });
            });
        }
    
    });
};
async function tLaunch() {
    if (!continueExecute) return;
    Log(tr('Starting Tosu'));
    return new Promise((resolve, reject) => {
        var output
        fs.access(path.join(Conf.getConf('AppPath'), "tosu.exe"), fs.constants.F_OK, error => {
            if (error) {
                Log(tr('Error trying to launch Tosu:') + `<br>${error}`);
                resolve(false);
            } else {
                const externalProcess = spawn(path.join(Conf.getConf('AppPath'), "tosu.exe"));
                const outputHandler = (data) => {
                    output = data.toString();
                    if (output.includes('ALL PATTERNS ARE RESOLVED')) { isOsuLanuched = true}
                    if (output.includes('Searching for osu!')) { Log('Wait Osu!')}
                    if (output.includes("Web server started")) { tsIsReady = true}
                };
                externalProcess.stdout.on("data", outputHandler);
                if(!isFirstTime){
                    setTimeout(() => { 
                      if(!isOsuLanuched){
                        mainWindow.webContents.send('EventError', tr('Wait Osu!')); 
                        resolve(true)
                      } else {
                        resolve(false)  
                      }
                    }, 5000);
                } else {
                    setTimeout(() => { 
                        if (!isOsuLanuched) {  
                            Log(tr("Please start Osu! and restart Bella Fiora Desktop"), true, true); 
                        } else {
                            resolve(false); 
                        }
                    }, 5000)
                }
                setTimeout(() => {
                    if (!isOsuLanuched) {
                        if (isFirstTime) {
                            mainWindow.webContents.send('EventError', tr('Wait Osu!')); 
                            let awaitOsu = setInterval(() => {
                                if(output.includes('ALL PATTERNS ARE RESOLVED')){
                                    clearTimeout(awaitOsu)
                                    resolve(false)   
                                }
                            }, 850);    
                        } else {
                            mainWindow.webContents.send('EventError', tr('Wait Osu!'))
                            resolve(true);  
                        }
                    }
                }, 8000);
            };
        });
    });
};
async function osuHandler(collections) {
    // Check if execution should continue
    if (!continueExecute) return
    // logFile.background('test', app)
    // Return a Promise
    return new Promise(async (resolve, reject) => {
        
        // Create new osuFiles and configuration objects
        const osuFiles = new OsuParse();
        const osudbReader = new OsuDBReader
        osudbReader.readCollectionDB(
            path.join(Conf.getConf('osu_path'), '/collection.db'), 
            path.join(Conf.getConf('osu_path'), '/osu!.db'),
            (callback)=>{
            collections = callback
        })
        // Check if beatmaps.json file exists in the specified path
        if (fs.existsSync(path.join(AppData, '/beatmaps.json'))) {
            // Log message for updating scores
            Log(tr('Update your Scores'), true, false);

            // Update scores using the osuFiles object
            osuFiles.updateScores(mainWindow).then(() => {
                resolve(true);
            });
        } else {
            // Log message for scanning beatmaps
            Log(tr('Scan your beatmaps'), true, false);

            // Parse osu database and scan beatmaps using osuFiles object
            osuFiles.osuDbParse(mainWindow).then(() => {
                // Log message for scanning scores
                Log(tr('Scan your scores'), true, false);

                // Parse score database and update scores using osuFiles object
                osuFiles.scoreDbParse(mainWindow).then(() => {
                    osuFiles.updateScores(mainWindow).then(() => {
                        resolve(true);
                    });
                });
            });
        };
    });
};
async function wsConnect(isAfterError) {
    // Check if execution should continue
    if (!continueExecute) return
    Log(tr('Connection to the Websocket'), true, false, true, isAfterError);
    // Create a new configuration object
    const Conf = new conf();
 
    mainWindow.webContents.send('ws_connect', true);
    // // Return a Promise
    return new Promise((resolve) => {
        // resolve(true);

        // Event listener for the result of Websocket connection
        ipcMain.on('ws_connect_result', (event, arg) => {
            if (arg) {
                // Log the result if available
                Log(arg, true, true);

                // Set continueExecute to false
                continueExecute = false;

            } else {
                // const localServer = new LocalServer(51247)
                resolve(true);
            }
        });

        // Event listener for receiving the Osu path from the main window
        ipcMain.on('ws_osu_path', (event, arg) => {
            // Set Osu path in the configuration
            Conf.setConf('osu_path', arg);
        });
    });
};
async function Log(e, show = true, err = false, toServ = true, afterErr = false) {
    const RemoteSrv = new remoteSrv()
    if (show) {
        if (err) {
            try { await mainWindow.webContents.send("loading_err", e, afterErr) }
            catch (e) { console.log(e); };
        } else {
            try { await mainWindow.webContents.send("progress_loading", e, afterErr) }
            catch (e) { console.log(e); };
        };
    };

    if (toServ) RemoteSrv.Log(e);
};
async function sendCache() {
    if (!continueExecute) return
    return new Promise((e, n) => {
        setTimeout(async () => {
            let settingsManager = new Settings()
            mainWindow.webContents.send('player-data', player_data);
            mainWindow.webContents.send('collections', collections);

            mainWindow.webContents.send('settings', settingsManager.getAll(), Conf.getConf('client_version'));
            if(Conf.getConf('Updated')){
                mainWindow.webContents.send('notification', `Bella Fiora Desktop has been successfully updated to ${Conf.getConf('client_version')}`, 'info');
                Conf.setConf('Updated',false)
            }
            
            e(true);
        }, 1000);
    });
};
async function loadPlugin(pluginAPI) {
    global.pluginAPI = pluginAPI;
    const pluginsPath = path.join(__dirname, 'plugin');
    const pluginFolders = fs.readdirSync(pluginsPath);

    for (const folder of pluginFolders) {
        const pluginFolderPath = path.join(pluginsPath, folder);
        const piFilePath = path.join(pluginFolderPath, 'pi.js');
        let valid = true
        try {
            const pluginContent = await readFile(piFilePath, 'utf-8');
            const context = {
                modulePath: piFilePath,
                module: {},
                exports: {},
                require: (modulePath) => {
                    PluginError(mainWindow, `Module <b>${modulePath.substring(modulePath.lastIndexOf("/") + 1)}</b> is not allowed 
                    in <b>${folder}</b>`, true)
                    // console.error(`Module "${modulePath.substring(modulePath.lastIndexOf("/") + 1)}" is not allowed.`);
                    valid = false
                }
            };

            const sanitizedContent = checkPlugin(pluginContent);

            const script = new vm.Script(sanitizedContent, {
                filename: piFilePath,
                displayErrors: true
            });

            const scriptResult = script.runInNewContext(context);
            const plugin = scriptResult || require(piFilePath);
            if (valid) {
                if (typeof plugin.void === 'function') {
                    if (plugin.void.length > 0) {
                        await new Promise((resolve) => plugin.void(global.pluginAPI, Math.floor(Math.random() * 10) + 1, resolve));
                    } else {
                        pluginAPI.void(global.pluginAPI);
                        // plugin.init(global.pluginAPI);
                    }
                    return true;
                } else {
                    console.error('Initialization was not possible due to the absence of an void function');
                }
            } else {
                return false
            }

        } catch (error) {
            console.error(`Error when loading ${folder}:`, error);
            throw error;
        }
    }

    return false;
}
function checkPlugin(pluginContent) {
    const restrictedRequire = `if (modulePath.startsWith('app/lib')) { throw new Error('Cannot load Private Module'); }`;
    const electronRequire = `if (modulePath === 'electron') { throw new Error('Cannot load Electron'); }`;
    return `${electronRequire}; ${restrictedRequire}; ${pluginContent}`;
};
async function createLogPluginWindow() {
    return new Promise((e, n) => {
        try {
            pluginLogs = new BrowserWindow({
                height: 250,
                width: 350,
                minWidth: 360,
                minHeight: 250,
                aspectRatio: 1133 / 648,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    paintWhenInitiallyHidden: true
                },

                titleBarStyle: 'hidden',
                titleBarOverlay:
                    { color: '#ffffff00', symbolColor: '#a84a89;', height: 30 },
                show: false
            });
            pluginLogs.loadFile('./app/front/log.html');

            pluginLogs.on('closed', () => { e(null) });
            pluginLogs.once('ready-to-show', () => {
                pluginLogs.show();

            });
            e(pluginLogs)
        } catch (e) {
            n(e)
        }
    })
};
async function loadTranslation(lang = null) {
    let settingsManager = new Settings()
    await settingsManager.load()
    Conf.setConf('lang', settingsManager.get('General', 'setLanguage'));
    let setLang = Conf.getConf('lang')
    if (lang) { setLang = lang; }
    const e = fs.readFileSync(`${Conf.getConf('AppPath')}/app/locales/${setLang}.json`, "utf-8");
    translations = JSON.parse(e)
    dictionnary = e
    
    return e
};
function tr(key) {
    return `${translations[key] || key}`
};
ipcMain.on('open-directory-dialog', (event, pathId) => {
    const window = BrowserWindow.getFocusedWindow();
    const defaultPath = path.join(process.env.LOCALAPPDATA);
    dialog.showOpenDialog(window, {
        properties: ['openDirectory'],
        defaultPath: defaultPath + '\\Osu!'
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const directoryPath = result.filePaths[0];
            let requiredFiles = ['osu!.exe', 'scores.db', 'presence.db', 'osu!.db'];
            if (pathId === "folderPathStable") {
                requiredFiles = ['osu!.exe', 'scores.db', 'presence.db', 'osu!.db'];
            } else {
                requiredFiles = ['osu!.exe', 'scores.db', 'presence.db', 'osu!.db'];
            }

            const missingFiles = requiredFiles.filter(file => !fs.existsSync(`${directoryPath}/${file}`));

            if (missingFiles.length > 0) {
                event.sender.send('file-check-failed', pathId, missingFiles);
            } else {
                event.sender.send('selected-directory', pathId, directoryPath);
            }
        }
    }).catch(err => {
        console.log('Error selecting directory:', err);
    });
});
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
            'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})
async function checkingUpdate() {
    Log('Cheking updates');
    return new Promise((resolve, reject) => {
        if(isDev){
            resolve()
            return
        }
        console.log(Conf.getConf('Updated'))
        autoUpdater.on("update-available",() => {
            Log('Download new version, application will quit to install.');
            autoUpdater.on('update-downloaded', () => {
                Conf.setConf('Updated', true)
                Log('Restart and install new version');
                setTimeout(async () => {
                autoUpdater.quitAndInstall();
                    
                }, 1200);
            });
        });

        autoUpdater.on("update-not-available",()=> {
            console.log('No update available. Continuing application launch.');
            resolve(); 
        });

        autoUpdater.on('error', error => {
            console.error(`Error during Update: ${error}`);
            reject(); 
        });

        autoUpdater.checkForUpdatesAndNotify().catch(err => {
            console.error("Error during check for updates:", err);
            reject();
        });
    });
}
async function checkLocalApp(){
    await (async () => {
        return new Promise(async (resolve, reject) => {
            let userPreferencesBase = require('./app/common/arrays/array_userPreference')
            if (Conf.getConf('AlreadyInstalled')) {
                await File.createIni("userPreferences", userPreferencesBase)
                fs.mkdir('static', (e) => { if (!e) { return true } })
                resolve()
            }
            if (!await File.check(path.join(Conf.getConf('LocalPath'), 'userPreferences.ini'))) {
                await File.createIni("userPreferences", userPreferencesBase)
                reject()
                continueExecute = false
            } else {
                resolve()
            }
        })
    })();
}