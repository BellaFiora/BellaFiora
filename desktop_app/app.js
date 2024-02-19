// *** Node Modules *** // 
const { app, BrowserWindow, dialog, ipcMain, shell, Notification, remote, ipcRenderer, protocol, session} = require('electron');
const {spawn} = require('child_process');
const axios = require('axios');
const tmp = require('tmp');
const vm = require('vm');
const util = require('util');
const fs = require('fs');

const path = require('path');
const url = require('url');
const http = require('http');


// const { Beatmap, Osu: { DifficultyCalculator, PerformanceCalculator} } = require('osu-bpdpc')
// const dns = require('dns');
// const { type } = require('os');

// *** App Libs *** // 
const osuFiles = require('./app/lib/osuFiles')
const {AppError, PluginError} = require('./app/lib/error')
const gini = require('./app/lib/ini')
const Artisan = require('./app/lib/artisan')
const remoteSrv = require('./app/lib/priv/remote-server')
const localSrv = require('./app/lib/local_server')
const conf = require('./app/lib/priv/credentials');
const LocalServer = require('./app/lib/local_server');
// const OsuDBReader = require('./app/lib/db_parser');
// const osuutils = require('./app/lib/osu_utils');

// First Configs 
require('dotenv').config();
let mainWindow //Main view Window Application
let cookieCheckWindow
let continueExecute = true
let isOsuLanuched
let gmIsReady
let player_data
// let isFirstTime = true;


const readFile = util.promisify(fs.readFile);

app.whenReady().then(async () => {
    const Conf = new conf();
    Conf.setConf('AppPath', app.getAppPath().replace("\\resources\\app.asar", ""));
    Conf.setConf('client_version','1.0.764');
  

    ipcMain.on('getMainWindow', () => mainWindow.webContents.send('mainWindow', mainWindow));
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    await LaunchLoading();
    await ServerConnection().then(resp=>{
        if(resp.err){
            Log(resp.err, true, true);
            continueExecute = false
        }
    }).catch((e=> {
        Log(e, true, true);
        continueExecute = false}));
        await gLaunch();
        await wsConnect();
        await osuConnect();
        await osuHandler();
        await LaunchGUI();
        await sendCache();
        // await getOsuSession()

        // Declaring API endpoints for external plugins
        const pluginAPI = {
            //Initalisation and creation of the user interface 
            Initialize: (obj) => {},
            Tab: (obj) => {},
            
            //Error monitoring and management
            Log:(obj)=> {
                console.log(obj)
            },
            FatalError:(obj)=>{
                PluginError(mainWindow, obj, true)
            },
            Error:(obj, exit = false)=>{
                PluginError(mainWindow, obj, exit)
            }, 

            //Get Objetcts
            PlayerData:async ()=>{}, //Return an object
            Osu: async()=>{}, //Return an object

            //GetFile
            LoadFile : async(Ext, file)=>{
                return new Promise((resolve, reject) => {
                    fs.readFile(`${Conf.getConf('AppPath')}/plugin/${Ext}/${file}`, 'utf8', (err, file) => {
                        if (err) {
                            PluginError(mainWindow, `Cannot load file <b>${file}</b>`)
                        } else {
                            resolve(file)
                        }
                    });
                })
               
            }

          };
          await loadPlugin(pluginAPI)

})
async function osuConnect() {
    if (!continueExecute) return
    // Log message for connecting Osu!Account
    Log('Connect your Osu!Account');

    // Create a new configuration object
    const Conf = new conf();
    // Return a Promise
    return new Promise(async (resolve, reject) => {
        // Check if Osu token exists in configuration
        if (Conf.getConf('osu_token')) {
            // Make a GET request to Osu! API to fetch user data
            axios.get('https://osu.ppy.sh/api/v2/me', {
                headers: { 'Authorization': `Bearer ${Conf.getConf('osu_token')}` },
            }).then(async response => {
                console.log(response.data.id);

                // Resolve if user ID exists in the response
                if (response.data.id) 
                // Call SyncData function
                await SyncData();
                resolve(true);
            }).catch(error => {
                console.error('Error fetching data:', error.message);
                reject(error);
            });
        } else {
            // If Osu token doesn't exist, perform authentication and sync data
            console.log('auth service');
            await AuthService();
            await SyncData();
            resolve(true);
        };
    });

    // Authentication function for Osu
    async function AuthService() {
        return new Promise(async (resolve, reject) => {
            // Open external URL for Osu! OAuth authorization
            shell.openExternal('https://osu.ppy.sh/oauth/authorize?client_id=30165&redirect_uri=https://techalchemy.fr/oAuth2/Bellafiora/index.php&response_type=code&scope=public identify');

            // Create a server for handling the authorization callback
            const server = http.createServer((req, res) => {
                const parsedUrl = url.parse(req.url, true);
                const queryParameters = parsedUrl.query;

                // Make a GET request to Osu! API with the received token
                axios.get('https://osu.ppy.sh/api/v2/me', { headers: { 'Authorization': `Bearer ${queryParameters.token}` } })
                    .then(response => {
                        console.log(queryParameters.token);
                        console.log(response.data.id);

                        // Resolve if user ID exists in the response
                        if (response.data.id) {
                            // Save Osu ID and token in configuration
                            Conf.setConf('osu_id', response.data.id);
                            Conf.setConf('osu_token', queryParameters.token);

                            // Close the authorization window
                            const closeWindowScript = '<script>window.close();</script>';
                            res.writeHead(200, {'content-Type':'text/html'})
                            res.write(`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>Authorization Success</title>
                              </head>
                              <body>
                                <h1>Authorization Successful!</h1>
                                <p>Your Osu ID: ${response.data.id}</p>
                                <p>Your Osu Token: ${queryParameters.token}</p>
                                <!-- You can customize the HTML content as needed -->
                              </body>
                            </html>`)
                            // res.end(closeWindowScript);
                            setTimeout(() => { server.close(); }, 500);

                            resolve(true);
                        }
                    }).catch(error => {
                        // Close the authorization window in case of error
                        const closeWindowScript = '<script>window.close();</script>';
                        res.end(closeWindowScript);
                        console.log(error);
                        server.close();
                    });
            });

            // Start the server on localhost:3000
            server.listen(3000, '127.0.0.1');
        });
    };

    // Function to synchronize data
    async function SyncData() {
        const Conf = new conf();
        const RemoteSrv = new remoteSrv();

        return new Promise(async (resolve, reject) => {
            try {
                // Make a GET request to a server for data synchronization
                await RemoteSrv.sync(Conf.getConf('client_id'),Conf.getConf('osu_token'), Conf.getConf('osu_id')).then(resp=>{
                   
                    if(!resp){
                        Log('Unauthorised on the server', true, true)
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
async function LaunchGUI(){
    if(!continueExecute) return
    return new Promise(async (e, n) => {
        const filePath = path.join('./app/src/html/body.raw');        
        const rawHTML = fs.readFileSync(filePath, 'utf-8');
        const artisan = new Artisan();
        let default_mode = player_data.gameplay.playmode
        default_mode = (default_mode === 'osu') ? 'm0' :
                    (default_mode === 'mania') ? 'm3' :
                    (default_mode === 'taiko') ? 'm1' :
                    (default_mode === 'fruits') ? 'm2' : 'm0';
        let gameplay = player_data.gameplay[default_mode]

        let data = {
            windowTitle: 'Bella Fiora Desktop',
            username: player_data.basic_informations.username,
            accuracy: parseFloat(gameplay.accuracy).toFixed(2),
            playcount: gameplay.plays_count,
            total_score: gameplay.total_score,
            maxCombo:gameplay.combo_max,
            ssh:gameplay.notes.ssh,
            ss:gameplay.notes.ss,
            sh:gameplay.notes.sh,
            s:gameplay.notes.s,
            a:gameplay.notes.a,
            global_rank:gameplay.global_rank,
            country_rank:gameplay.country_rank,
            clicks:gameplay.clicks,
            pp:parseFloat(gameplay.pp).toFixed(2),
            avatar_url:player_data.basic_informations.avatar_url,
            country:player_data.basic_informations.country,
        }
        artisan.create({
            props: {
                lang: (player_data.basic_informations.country).toLowerCase(),
                // lang: 'en',
                objectType: 'document',
                format: 'html',
                charset: 'UTF-8', 
                viewPort: 'width=device-width, initial-scale=1.0',
                ressources: {
                  css: ["../src/style.css", "https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/2.3.2/rangeslider.css"],
                  scripts: [
                    {
                      href: '../renderers/gui_renderer.js',
                      defer: true,
                      position: 'endBody'
                    }, 
                    {
                      href: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
                      position: 'Header',
                      type: 'module'
                    }, {
                        href: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js',
                        position: 'Header',
                        nomodule: true
                    }
                  ], 
                  links: [
                    {
                      href: 'https://fonts.googleapis.com',
                      rel: 'preconnect',
                      position: 'Header'
                    }, {
                      href: 'https://fonts.gstatic.com',
                      rel: 'preconnect',
                      position: 'Header',
                      cross : "crossorigin"
                    }, {
                      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap',
                      rel: 'stylesheet',
                      position: 'Header'
                    }, {
                      href: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
                      rel: 'stylesheet',
                      position: 'Header'
                    }, {
                      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300&display=swap',
                      rel: 'stylesheet',
                      position: 'Header'
                    }, {
                      href: 'https://cdnjs.cloudflare.com/ajax/libs/rangeslider.js/2.3.2/rangeslider.css',
                      rel: 'stylesheet',
                      position: 'Header'
                    },
                  ]
                }
            }
        })
        .addContentHTML(rawHTML, data)
        .construct().then(r=>{
            const tempHTMLPath = path.join('./app/front/gui2.html');
            fs.writeFile(tempHTMLPath, r, (writeErr) => {
                if (writeErr) {
                    console.error('Erreur lors de l\'écriture du fichier temporaire:', writeErr);
                    return;
                }
                mainWindow.loadFile("./app/front/gui2.html");
                e(true);
            });  
        });
        e(true)
    });
};
async function ServerConnection() {
    // Check if execution should continue
    if (!continueExecute) return

    // Create new configuration and remote server objects
    const Conf = new conf();
    const RemoteSrv = new remoteSrv();

    // Fetch the client's IP address using an external API
    let ipResponse
    try {
        ipResponse = await axios.get("https://api64.ipify.org?format=json");
    } catch(e){
        AppError(mainWindow, 'Please Enable Internet Connection');
        continueExecute = false;
        return
    };

    // Set the client's IP address in the configuration
    Conf.setConf('client_ip', ipResponse.data.ip);

    // Return a Promise
    return new Promise(async (resolve, reject) => {
        // Check if client ID exists in the configuration
        if (Conf.getConf('client_id')) {
            // Log message for server synchronization
            Log('Server Synchronization..');

            // Perform login to the remote server
            RemoteSrv.Login(mainWindow).then(result => {
                resolve({ stat: result.stat, err: result.err });
            });
        } else {
            // Log message for server registration
            Log('Server Register');

            // Perform registration to the remote server
            RemoteSrv.Reg(mainWindow).then(result => {
                resolve({ stat: result.stat, err: result.err });
            });
        };
    });
};
async function gLaunch(){
    if(!continueExecute) return
    Log('Starting Gosumemory');
    return new Promise(async (o, r) => {
        let s;
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
                                    new gini().set('Main', 'update',1);
                                    gosumemoryProcess = externalProcess;
                                    // gIni.set('Main', 'update',1);
                                    n(externalProcess);
                                };
                            })
                        };
                    });
                    const t = new Promise(n => {
                        s = setTimeout(() => {
                            if (!gmIsReady) {
                                if (isOsuLanuched) {
                                    Log("If this is the first time, start Osu!", true, true);
                                    setTimeout(async () => {
                                        o(false);
                                        isOsuLanuched = false;
                                    }, 3000);
                                } else { Log("Error When Launching Gosumemory", true, true); o(false)};
                            } else {o(true)};
                        }, 10e3);
                    });
                    Promise.race([n, t]).then(e => {o(e)}).
                    catch(e => {
                        Log("Error When Launching Gosumemory", true, true);
                        isOsuLanuched = false;
                        o(e);
                    });
                };
            });
        } catch(e){Log(`Error When Launching Gosumemory: ${e.message}`, true, true); o(e)};
    });
};
async function osuHandler() {
    // Check if execution should continue
    if (!continueExecute) return

    // Return a Promise
    return new Promise(async (resolve, reject) => {
        // Create new osuFiles and configuration objects
        const OsuFiles = new osuFiles();
        const Conf = new conf();

        // Check if beatmaps.json file exists in the specified path
        if (fs.existsSync(path.join(Conf.getConf('AppPath'), '/beatmaps.json'))) {
            // Log message for updating scores
            Log('Update your Scores', true, false);

            // Update scores using the osuFiles object
            OsuFiles.updateScores(mainWindow).then(() => {
                resolve(true);
            });
        } else {
            // Log message for scanning beatmaps
            Log('Scan your beatmaps', true, false);

            // Parse osu database and scan beatmaps using osuFiles object
            OsuFiles.osuDbParse(mainWindow).then(() => {
                // Log message for scanning scores
                Log('Scan your scores', true, false);

                // Parse score database and update scores using osuFiles object
                OsuFiles.scoreDbParse(mainWindow).then(() => {
                    OsuFiles.updateScores(mainWindow).then(() => {
                        resolve(true);
                    });
                });
            });
        };
    });
};
async function wsConnect() {
    // Check if execution should continue
    if (!continueExecute) return

    // Create a new configuration object
    const Conf = new conf();

    // Log message for connecting to the Websocket
    Log('Connection to the Websocket');

    // Send a message to the main window to initiate Websocket connection
    mainWindow.webContents.send('ws_connect', true);

    // Return a Promise
    return new Promise((resolve) => {
        // Event listener for the result of Websocket connection
        ipcMain.on('ws_connect_result', (event, arg) => {
            if (arg) {
                // Log the result if available
                Log(arg, true, true);

                // Set continueExecute to false
                continueExecute = false;

            } else {
				const localServer = new LocalServer(51247)
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
async function Log(e, show = true, err = false, toServ= true) {
    const RemoteSrv = new remoteSrv()
    if (show) {
        if(err){
            try { await mainWindow.webContents.send("loading_err", e)} 
            catch(e){ console.log(e);};
        } else {
            try {await mainWindow.webContents.send("progress_loading", e)}
            catch(e){console.log(e);};
        };
    };

    if(toServ) RemoteSrv.Log(e);
};
async function sendCache(){
    if(!continueExecute) return
    return new Promise((e, n) => { setTimeout(async () => {
        console.log(player_data.basic_informations)
        
        mainWindow.webContents.send('player-data', player_data);
        e(true);
    }, 1000);});
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
            if(valid){
                if (typeof plugin.init === 'function') {
                    if (plugin.init.length > 0) {
                        await new Promise((resolve) => plugin.init(global.pluginAPI, resolve));
                    } else {
                        plugin.init(global.pluginAPI);
                    }
                    return true;
                } else {
                    console.error('Initialization was not possible due to the absence of an initialization function');
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
async function getOsuSession() {
    return new Promise(async (resolve, reject) => {
        try {
            const session = await createCookieCheckWindow();
            if(session){
                if(cookieCheckWindow){
                    cookieCheckWindow.close();
                }
                resolve(session)
            } else {
                const intervalId = setInterval(async () => {
                    try {
                    const cookies = await session.cookies.get({});
                    const osuSessionCookie = cookies.find(cookie => cookie.name === 'osu_session');
                    if (osuSessionCookie) {
                        
                        resolve(osuSessionCookie)

                        clearInterval(intervalId);
                    }
                    } catch (error) {
                    console.error(error);
                    }
                }, 1000);
            }
            
            } catch (error) {
            console.error(error);
            }
    })
    async function createCookieCheckWindow() {
        return new Promise((resolve, reject) => {
          cookieCheckWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
              nodeIntegration: true,
            },
          });
    
          cookieCheckWindow.loadURL('https://osu.ppy.sh');
          const cookieSession = cookieCheckWindow.webContents.session;
          cookieCheckWindow.on('closed', () => {
            cookieCheckWindow = null;
          });
          cookieCheckWindow.webContents.on('did-finish-load', async () => {
            try {
              const cookies = await cookieSession.cookies.get({});
              const osuSessionCookie = cookies.find(cookie => cookie.name === 'osu_session');
              if (osuSessionCookie) {
                resolve({session:osuSessionCookie.value});
                cookieCheckWindow.close();
              }
              resolve({session:null});
              
            } catch (error) {
              reject(error);
            }
          });
        });
    };
};
