const { ipcRenderer } = require('electron');
ipcRenderer.on('log', (event, data) => {
	document.getElementById('logs').innerHTML +=`${data}<br>`
});