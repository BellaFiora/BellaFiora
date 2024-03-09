const { DataTypes, sequelize } = require('/app/node_modules/sequelize');
const db_bellafiora = require('/app/src/sequelize')

const AppMetric = db_bellafiora.define(
	'app_metric', {
		id : {
			type : DataTypes.INTEGER,
			allowNull : false,
			autoIncrement : true,
			primaryKey : true,
		},
		app : {
			type : DataTypes.STRING,
			allowNull : false,
		},
		start : {
			type : DataTypes.DATE,
			allowNull : false,
		},
		time : {
			type : DataTypes.INTEGER,
			allowNull : false,
		},
		exit : {
			type : DataTypes.INTEGER,
			allowNull : false,
		},
		log : {
			type : DataTypes.TEXT,
			allowNull : false,
		},
	},
	{
		tableName : 'app_metrics',
		collate : 'utf8mb4_general_ci',
		engine : 'InnoDB',
		timestamps : false,
		raw : true,
	});

const User = db_bellafiora.define(
	'User', {
		id : {
			type : DataTypes.INTEGER.UNSIGNED,
			primaryKey : true,
			autoIncrement : true,
			allowNull : false,
		},
		user_id : {
			type : DataTypes.INTEGER(9).UNSIGNED,
			allowNull : false,
		},
		first_use : {
			type : DataTypes.DATE,
			allowNull : false,
		},
		last_use : {
			type : DataTypes.DATE,
			allowNull : false,
		},
		last_login : {
			type : DataTypes.DATE,
			allowNull : true,
		},
		session_id : {
			type : DataTypes.INTEGER(32),
			allowNull : true,
			defaultValue : null,
		},
		speed_level : {
			type : DataTypes.STRING(50),
			allowNull : true,
			defaultValue : null,
		},
		api_key : {
			type : DataTypes.CHAR(50),
			allowNull : false,
			defaultValue : '',
			collate : 'utf8mb4_general_ci',
		},
		api_key_status : {
			type : DataTypes.TINYINT(4),
			allowNull : true,
			defaultValue : 1,
		},
		api_requests : {
			type : DataTypes.INTEGER(7),
			allowNull : true,
			defaultValue : 0,
		},
		global_rank : {
			type : DataTypes.INTEGER(6),
			allowNull : false,
			defaultValue : 0,
		},
		country : {
			type : DataTypes.STRING(3),
			allowNull : false,
			defaultValue : 'FR',
			collate : 'utf8mb4_general_ci',
		},
		pp : {
			type : DataTypes.FLOAT,
			allowNull : false,
			defaultValue : 0,
		},
		stream_level : {
			type : DataTypes.INTEGER(3),
			allowNull : true,
			defaultValue : 100,
		},
		jump_level : {
			type : DataTypes.INTEGER(3),
			allowNull : true,
			defaultValue : 100,
		},
		tech_level : {
			type : DataTypes.INTEGER(3),
			allowNull : true,
			defaultValue : 100,
		},
		speed_level : {
			type : DataTypes.INTEGER(3),
			allowNull : true,
			defaultValue : 100,
		},
	},
	{
		tableName : 'users',
		collate : 'utf8mb4_general_ci',
		engine : 'InnoDB',
		timestamps : false,
		raw : true,
	});



const Client = db_bellafiora.define(
	'Client', {
		client_id: {
			type: DataTypes.CHAR(8),
			allowNull: false,
			primaryKey: true,
		},
		ip: {
			type: DataTypes.CHAR(64),
			allowNull: false,
		},
		player_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		first_use: {
			type: DataTypes.TIMESTAMP,
			allowNull: false,
		},
		last_use: {
			type: DataTypes.TIMESTAMP,
			allowNull: false,
		},
		osu_token: {
			type: DataTypes.CHAR(256),
			allowNull: true,
			defaultValue: null,
		},
		osu_code: {
			type: DataTypes.CHAR(256),
			allowNull: true,
			defaultValue: null,
		},
		osu_token_dt: {
			type: DataTypes.TIMESTAMP,
			allowNull: true,
			defaultValue: null,
		},
		is_connected: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: null,
		},
		is_restricted: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: null,
		},
		is_banned: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: null,
		},
		localisation: {
			type: DataTypes.STRING(128),
			allowNull: true,
			defaultValue: null,
		},
		langue: {
			type: DataTypes.CHAR(2),
			allowNull: true,
			defaultValue: null,
		},
		client_type: {
			type: DataTypes.SMALLINT,
			allowNull: true,
			defaultValue: null,
		},
	},
	{
		tableName : 'users',
		collate : 'utf8mb4_general_ci',
		timestamps : false,
		raw : true,
	});
module.exports = {
	AppMetric,
	User
};
