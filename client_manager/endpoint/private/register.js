const db_bellafiora = require('../../src/sequelize');
const { AppMetric, User } = require('/common/ressources/SequelizeShemas');
const envFile = '/common/env/.env';
const dotenv = require('dotenv');
dotenv.config({ path: envFile });

async function handleRequest(query){

}
module.exports = {handleRequest}