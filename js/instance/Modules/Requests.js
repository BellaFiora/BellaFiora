const axios = require('axios');
const dotenv = require('dotenv');
const UrlConstructor = require('../Modules/UrlConstructor'); 
dotenv.config();

class Osu {
    constructor() {
        
    }

    async getUser(user, limit = 100, mode = null) {
        const userData = {
            md: {
                registration_date: null,
                default_mode: null,
                user_id: null,
                updated_date: null
            },

            osu: [],
            taiko:  [],
            ctb: [],
            mania: []
        };
        const url = new UrlConstructor()
        try {
            if (!user) {
                throw new Error('Please specify a user');
            }
            let valueType = typeof user === 'number' ? 'id' : 'string';
            var osuUrl = await url.get_user_url(user, valueType, "", 100, 0);
            if (osuUrl) {
                var response = await axios.get(osuUrl);
                response.data; 
                userData.osu.push(response.data[0]);

                osuUrl = await url.get_user_url(user, valueType, "", 100, 1);
                response = await axios.get(osuUrl);
                userData.taiko.push(response.data[0]);

                osuUrl = await url.get_user_url(user, valueType, "", 100, 2);
                response = await axios.get(osuUrl);
                userData.ctb.push(response.data[0]);

                osuUrl = await url.get_user_url(user, valueType, "", 100, 3);
                response = await axios.get(osuUrl);
                userData.mania.push(response.data[0]);

                userData.md.registration_date = new Date().toDateString();
                userData.md.default_mode = 0;
                userData.md.user_id = response.data[0].user_id
                return userData


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
