const axios = require('axios');
const dotenv = require('dotenv');
const UrlConstructor = require('../Modules/UrlConstructor'); 
dotenv.config();

class Osu {
    constructor() {
        // API key ou toute autre initialisation peut être ajoutée ici
    }
    async getUser(user, limit = 100, mode = null) {
        try {
            if (!user) {
                throw new Error('Please specify a user');
            }
            let valueType = typeof user === 'number' ? 'id' : 'string';
            const osuUrl = UrlConstructor.get_user_url(user, valueType, 100); 
            if (osuUrl) {
                const response = await axios.get(osuUrl);
                return response.data; 

            } else {
                throw new Error('Invalid base data');
            }

        } catch (error) {
            if (error.response) {
                throw new Error(`Error: ${error.response.status} - ${error.response.statusText}`);
            } else if (error.request) {
                throw new Error('Error: No response received');
            } else {
                throw new Error('Error: ' + error.message);
            }
        }
    }
}

async function API() {
    try {
      const apiKeys = [];
      for (let i = 1; i <= 7; i++) {
        const apiKey = process.env[`osuApiKey${i}`];
        console.log(apiKey)
        if (apiKey) {
          apiKeys.push(apiKey);
        }
      }
      const selectedApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      return selectedApiKey;
    } catch (error) {
      return 'null'
    }
  }

  module.exports = Osu;
