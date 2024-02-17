
// *** Node Modules *** // 
const { app, BrowserWindow, dialog, ipcMain, shell, Notification, remote, ipcRenderer, protocol} = require('electron');
const {spawn} = require('child_process');
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const conf = require('./app/lib/priv/credentials')
const url = require('url');
const http = require('http');
const remoteSrv = require('./app/lib/priv/remote-server')

// const { Beatmap, Osu: { DifficultyCalculator, PerformanceCalculator} } = require('osu-bpdpc')
// const dns = require('dns');
// const { type } = require('os');



// *** App Libs *** // 
const osuFiles = require('./app/lib/osuFiles')
const AppError = require('./app/lib/error')
const gini = require('./app/lib/ini')
// const OsuDBReader = require('./app/lib/db_parser');
// const osuutils = require('./app/lib/osu_utils');

// First Configs 
require('dotenv').config();
let mainWindow = null ; //Main view Window Application
let continueExecute = true ;
let isOsuLanuched;
let gmIsReady;
let player_data;
// let isFirstTime = true;

app.whenReady().then(async () => {
    const Conf = new conf();
    Conf.setConf('AppPath', app.getAppPath().replace("\\resources\\app.asar", ""));
    // fs.readFile(path.resolve(Conf.getConf('AppPath'),'./package.json'), 'utf8', (err, output) => {
    //     const packageFile = JSON.parse(output);
        Conf.setConf('client_version','1.0.764');
    // });
    ipcMain.on('getMainWindow', () => mainWindow.webContents.send('mainWindow', mainWindow));
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    await LaunchGUI();
    await ServerConnection().then(resp=>{

        if(resp.err){
            Log(resp.err, true, true);
            continueExecute = false
        }})
    .catch((e=> {
        console.log('test')
        Log(e, true, true);
        continueExecute = false}));
    await gLaunch();
    await wsConnect();
    await osuConnect();
    await osuHandler();
    await mainApp();
    await sendCache();

    protocol.registerFileProtocol('app', (request, callback) => {
        const url = request.url.substr(7); // Supprime le préfixe 'app://'
        const filePath = path.normalize(`${__dirname}/${url}`);
        callback({ path: filePath });
      });

});
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
                if (response.data.id) resolve(true);

                // Call SyncData function
                await SyncData();
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
                        player_data = resp
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
async function mainApp(){
    if(!continueExecute) return
    return new Promise((e, n) => {
        mainWindow.loadFile("./app/front/gui.html");
        e(true)
    });
};
async function LaunchGUI() {
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

                // Send client information to the window
                let clientInfo = {
                    client_version: Conf.getConf('client_version'),
                    client_ip: Conf.getConf('client_ip'),
                    client_id: Conf.getConf('client_id')
                };

                mainWindow.webContents.send('client_informations', clientInfo);

                // Save the mainWindow reference in configuration
                Conf.setConf('app', mainWindow);

                resolve(mainWindow);
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
                                    const gIni = new gini();
                                    gosumemoryProcess = externalProcess;
                                    gIni.set('Main', 'update',1);
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
        mainWindow.webContents.send('player-data', player_data);
        console.log('send');
        e(true);
    }, 1000);});
};