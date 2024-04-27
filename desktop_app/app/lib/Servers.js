const WebSocket = require('ws');

class LocalServer {
    constructor(port) {
      this.port = port;
      this.wss = new WebSocket.Server({ port: this.port });
  
      this.wss.on('connection', (ws) => {
        console.log('Extension Linked')
        ws.on('message', (message) => {
          console.log(`Message reçu : ${message}`);
        });
  
        ws.on('close', () => {
          console.log('Connexion WebSocket fermée.');
        });
      });
    }
    diffuserMessage(message) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  module.exports = LocalServer