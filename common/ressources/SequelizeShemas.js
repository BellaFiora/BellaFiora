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
    timestamps: false,
    raw: true,
  });



module.exports = { AppMetric };
