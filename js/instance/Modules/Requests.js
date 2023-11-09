const axios = require('axios');
const dotenv = require('dotenv');
const url = require('../Modules/UrlConstructor')
dotenv.config();
class Osu {
  constructor() {

  }
 async getUser(user, method = 'get', limit = 100, mode = null, data = null){
    if(user){
        var valueType;
        if(typeof(user) === "number"){
            valueType = "id";
        } else {
            valueType = "string";
        }   
        const k = await API()
        const Url = new url()
        const osuUrl = await Url.get_user(user, valueType, k, 100) 
        if(osuUrl){
            try {
                const response =  await axios.get(osuUrl);
                data = response.data
                return data;
            } catch(e){
                throw new Error('Error to fetch')
            }
        } else {
            console.log('Base Data is invalid')
        }
    } else {
        throw new Error('Please specify a user')
    }
 }
//  async getUserBest(user, max=100){

//  }
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
