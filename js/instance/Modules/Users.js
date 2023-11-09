const axios = require('axios');

class UserDatas {
  constructor() {
    this.data = {
      userData: {},
      userBest: {},
      errors: [],
    };
  }
  async get(user) {
    const userDataUrl = `https://osu.ppy.sh/api/get_user?k=d5de1460146f9b4509824349b01aec03a0f2b122&u=${user}&type=string`;
    const userBestUrl = `https://osu.ppy.sh/api/get_user_best?k=d5de1460146f9b4509824349b01aec03a0f2b122&u=${user}&type=string&mode=0&limit=5`;
    try {
      const userDatas = await axios.get(userDataUrl);
      const userBest = await axios.get(userBestUrl);
      this.data.userData['userId'] = userDatas.data[0].user_id;
      this.data.userData['userName'] = userDatas.data[0].username;
      this.data.userData['joinDate'] = userDatas.data[0].join_date; 
      this.data.userData['count300'] = userDatas.data[0].count300;
      this.data.userData['count100'] = userDatas.data[0].count100;
      this.data.userData['count50'] = userDatas.data[0].count50;
      this.data.userData['playCount'] =  userDatas.data[0].playcount;
      this.data.userData['rankedScore'] = userDatas.data[0].ranked_score;
      this.data.userData['totalScore'] = userDatas.data[0].total_score;
      this.data.userData['globalRank'] = userDatas.data[0].pp_rank;
      this.data.userData['countryRank'] = userDatas.data[0].pp_country_rank;
      this.data.userData['level'] = userDatas.data[0].level;
      this.data.userData['ppRaw'] = userDatas.data[0].pp_raw;
      this.data.userData['accuracy'] = parseFloat((userDatas.data[0].accuracy)).toFixed(4);
      this.data.userData['country'] = userDatas.data[0].country
    } catch (error) {
      this.data.errors.push(error.message);
    }
    return this.data
  }
}

module.exports = UserDatas;

