const {ipcRenderer} = require('electron');

ipcRenderer.on('progress_loading', (event, stat) => {
    document.getElementById('progress_loading').innerHTML = stat
})

ipcRenderer.on('fader', (event, fader) => {
    document.body.classList.add(fader)
})