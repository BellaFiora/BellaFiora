const db_bellafiora = require('../../src/sequelize');
const { AppMetric, User } = require('/common/ressources/SequelizeShemas');
const envFile = '/common/env/.env';
const dotenv = require('dotenv');
dotenv.config({ path: envFile });

async function Static(req){
    let query = req.query
    return new Promise((resolve, reject) => {
        //next
        resolve('done')
    })
}
module.exports = {Static}