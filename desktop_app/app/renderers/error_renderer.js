const { ipcRenderer } = require('electron');
function restart() {
	ipcRenderer.send('restart_app');
}

ipcRenderer.on(
	'err', (event, data) => { document.getElementById('err').innerHTML = data })