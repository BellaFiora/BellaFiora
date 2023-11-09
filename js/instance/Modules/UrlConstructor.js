const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

class url {
  constructor() {

  }
  async get_user(user, type, apiKey, limit = 100, mode = null){
    mode = mode !== null ? `&mode=${mode}` : "";
    if(user && apiKey && limit && type){     
        const Url = `https://osu.ppy.sh/api/get_user?k=${apiKey}&u=${user}&type=${type}&limit=${limit}`
        return Url
    } else {
        return false
    }
  }
}
module.exports = url;
