const db_bellafiora = require('../../src/sequelize');
const { AppMetric, User } = require('/common/ressources/SequelizeShemas');

const envFile = '/common/env/.env';
const dotenv = require('dotenv');

dotenv.config({ path: envFile });

async function Static(req){
  let query = req.query
  return new Promise((resolve, reject) => {
    const indexOfSecondDot = query.version.indexOf('.', query.version.indexOf('.') + 1);
    versionNumber = parseFloat(query.version.substring(0, indexOfSecondDot) + query.version.substring(indexOfSecondDot + 1));  
    let minimalVersion = 1.0764
    if(versionNumber < minimalVersion){
      minimalVersion = minimalVersion.toString()
      const indexOfFirstDot = minimalVersion.indexOf('.');
      const minimalVersion = minimalVersion.substring(0, indexOfFirstDot + 2) + '.' + minimalVersion.substring(indexOfFirstDot + 2);
      console.log(`Client ${query.idApp} is logged, on ${query.ipAddress} and use version ${query.version}: Old version, MD5 is Ok`)
      return `Please update bellafiora. Minimum version accepted: ${minimalVersion}`
    } else {
      //next
      // const date = new Date()
      // const test  = {
      //   last_use: date,
      //   last_login: date,
      //   ip : query.ipAddress,
      //   osu_token: query.osu_token,
      //   is_online: 1,
      // }
      // console.log(test)
      // try {
      //   User.update({
      //     last_use: date,
      //     last_login: date,
      //     ip : query.ipAddress,
      //     osu_token: query.osu_token,
      //     is_online: 1,
      //   }, {
      //     where: {
      //       user_id: query.user_id
      //     }
      //   })
      //   .then((result) => {
      //     console.log(result); 
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      // } catch(e){
      //   console.log(e)
      // }
      resolve('done')
    }
  })
  

}
module.exports = {Static};
