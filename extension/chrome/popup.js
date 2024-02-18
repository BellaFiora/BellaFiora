 const message_link_dapp = document.getElementById('dapp_link')
const urlWebSocket = 'ws://127.0.0.1:24050/ws';
let socket;

function connectWebSocket() {
    socket = new WebSocket(urlWebSocket);
    socket.onopen = function(event) {
        message_link_dapp.color = 'rgb(169, 247, 169)'
        message_link_dapp.classList.add('linked')
        message_link_dapp.innerText = 'Linked'
    };
    socket.onmessage = function(event) {
    };

    socket.onclose = function(event) {setTimeout(reconnect, 1000) };
    socket.onerror = function(error) {setTimeout(reconnect, 1000)};
}

function reconnect(){
    message_link_dapp.color = 'rgb(248, 172, 84);'
    message_link_dapp.classList.remove('linked')
    message_link_dapp.innerText = 'Not Linked'
    console.error('Erreur : ', error);
    connectWebSocket
}

connectWebSocket();