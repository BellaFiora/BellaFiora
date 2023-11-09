const bjs = require("bancho.js");

class Client{
  constructor(username, password) {
    this.client = new bjs.BanchoClient({ username, password });

    this.client.on("error", (error) => {
      console.error("Erreur de connexion IRC:", error);
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connecté à l'IRC avec succès.");
    } catch (error) {
      console.error("Échec de la connexion IRC:", error);
    }
  }

  listen(callback) {
    this.client.on("PM", (message) => {
      callback(message);
    });
  }

  async send(message, content) {
    try {
      await message.user.sendMessage(content);
    //   console.log(`Message envoyé à ${receiver}: ${message}`);
    } catch (error) {
      console.error(`Échec de l'envoi du message à ${receiver}:`, error);
    }
  }
}
module.exports = Client;
