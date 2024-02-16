const { DataTypes, sequelize} = require('/app/node_modules/sequelize');
const db_bellafiora = require('/app/src/sequelize')


  const AppMetric = db_bellafiora.define('app_metric', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    app: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    log: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'app_metrics',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
    timestamps: false,
    raw: true,
  });

  const User = db_bellafiora.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(9).UNSIGNED,
      allowNull: false,
    },
    first_use: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_use: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    session_id: {
      type: DataTypes.INTEGER(32),
      allowNull: true,
      defaultValue: null,
    },
    speed_level: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    api_key: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: '',
      collate: 'utf8mb4_general_ci',
    },
    api_key_status: {
      type: DataTypes.TINYINT(4),
      allowNull: true,
      defaultValue: 1,
    },
    api_requests: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
      defaultValue: 0,
    },
    global_rank: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
      defaultValue: 0,
    },
    country: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'FR',
      collate: 'utf8mb4_general_ci',
    },
    pp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    stream_level: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      defaultValue: 100,
    },
    jump_level: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      defaultValue: 100,
    },
    tech_level: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      defaultValue: 100,
    },
    speed_level: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
      defaultValue: 100,
    },
  }, {
    tableName: 'users',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
    timestamps: false,
    raw: true,
  });



module.exports = { AppMetric, User };
