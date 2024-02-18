const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const envFile = '/common/env/.env';

dotenv.config({ path : envFile });

const db_bellafiora = new Sequelize({
	host : process.env.db_localhost,
	port : process.env.db_port,
	username : process.env.db_username,
	password : process.env.db_password,
	database : process.env.db_database,
	dialect : 'mysql',
});

module.exports = db_bellafiora;