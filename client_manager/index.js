const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const Metrics = require('./Metrics/Modules/Metrics');
const IdGenerate = require('./Modules/IdGenerate');
const endpoints = require('./endpoints');

const { AppMetric } = require('/common/ressources/SequelizeShemas');
const db_bellafiora = require('./src/sequelize');

const app = express();
const port = 25586;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  const checksum = 'null';

  if (req.headers.checksum === checksum) {
    next();
  } else {
    res.status(403).send('Basic');
  }
});

app.get('/client/register', (req, res) => {
    const { idApp, ipAddress, version } = req.body;
    console.log(`Client ${idApp} is started, on ${ipAddress} and use version ${version}`)
//   res.send('Bienvenue sur le serveur web sécurisé!');
});

app.listen(port, () => {
  
});