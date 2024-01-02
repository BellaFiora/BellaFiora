const { app, BrowserWindow, screen,  ipcRenderer} = require('electron');

function submitLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  document.getElementById('errorMessage').innerText = '';
  document.getElementById('btn-login').classList.add('disable')
  document.getElementById('btn-login').disabled = true
  document.getElementById('username').disabled = true
  document.getElementById('password').disabled = true


  ipcRenderer.send('login-submitted', username, password);

}

ipcRenderer.on('status', (event, stat)=> {
    if(!stat){
        document.getElementById('errorMessage').innerTex='Bah Authentification';
        document.getElementById('btn-login').classList.remove('disable')
        document.getElementById('btn-login').disabled = false
        document.getElementById('username').disabled = false
        document.getElementById('password').disabled = false
    } 
})