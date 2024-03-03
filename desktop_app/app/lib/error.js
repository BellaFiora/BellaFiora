const {
	app,
	BrowserWindow,
	dialog,
	ipcMain,
	shell,
	Notification,
	remote,
	ipcRenderer
}
= require('electron');

async function AppError(mainWindow, err) {
	if (mainWindow) {
		mainWindow.close()
	}
	return new Promise((e, n) => {
		try {
			const errWindow = new BrowserWindow({
				height : 250,
				width : 350,
				minWidth : 360,
				minHeight : 250,
				aspectRatio : 1133 / 648,
				webPreferences : {
					nodeIntegration : true,
					contextIsolation : false,
					paintWhenInitiallyHidden : true
				},

				titleBarStyle : 'hidden',
				titleBarOverlay :
					{ color : '#ffffff00', symbolColor : '#a84a89;', height : 30 },
				show : false
			});
			errWindow.loadFile('./app/front/error.html');

			errWindow.on('closed', () => { e(null) });
			errWindow.once('ready-to-show', () => {
				errWindow.show();
				errWindow.webContents.send('err', err)

				ipcMain.on('restart_app', () => {
					app.relaunch();
					app.exit(0);
				});
			});
			e(errWindow)
		} catch (e) {
			n(e)
		}
	})
}

async function PluginError(mainWindow, err, closeWindow = false) {
	if (mainWindow && closeWindow) {
		mainWindow.close()
	}
	return new Promise((e, n) => {
		try {
			const errWindow = new BrowserWindow({
				height : 250,
				width : 350,
				minWidth : 360,
				minHeight : 250,
				aspectRatio : 1133 / 648,
				webPreferences : {
					nodeIntegration : true,
					contextIsolation : false,
					paintWhenInitiallyHidden : true
				},

				titleBarStyle : 'hidden',
				titleBarOverlay :
					{ color : '#ffffff00', symbolColor : '#a84a89;', height : 30 },
				show : false
			});
			errWindow.loadFile('./app/front/pluginError.html');

			errWindow.on('closed', () => { e(null) });
			errWindow.once('ready-to-show', () => {
				errWindow.show();
				errWindow.webContents.send('err', err)

				ipcMain.on('restart_app', () => {
					app.relaunch();
					app.exit(0);
				});
			});
			e(errWindow)
		} catch (e) {
			n(e)
		}
	})
}

module.exports = {AppError, PluginError}