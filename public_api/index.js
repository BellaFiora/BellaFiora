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
const envFile = '/common/env/.env';

dotenv.config({ path: envFile });

const port = process.env.PORT || 25586;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/private/*', requestHandler);
app.get('/api/public/*', requestHandler);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Public API is running on ${port}`);
});

async function requestHandler(req, res) {
  const metrics = new Metrics();
  const idGenerator = new IdGenerate();
  const id = idGenerator.create();
  const startTime = metrics.getDate();
  let elapsedTime = 0;
  let exitCode = 0;
  let logs = {};

  metrics.TimerStart(id);

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const requestData = req.query;
    const endpointPath = req.path.split('/')[3];
    const endpoint = endpoints.find(e => e.name === endpointPath);

    if (endpoint) {
      const folder = endpoint.type === 'private' ? 'private' : 'public';
      const filePath = path.join(__dirname, 'endpoint', folder, `${endpointPath}.js`);

      try {
        await fs.access(filePath); 

        const endpointHandler = require(filePath);
        const responseData = await endpointHandler.handleRequest(endpoint, requestData);

        if (responseData.error && responseData.error === 'Unauthorized') {
          logs = { client: clientIp, endpoint: endpointPath, error: responseData.error, status_code: responseData.status_code, request_data: requestData };
          res.status(responseData.status_code || 200).json(responseData.error);
        } else {
          res.status(responseData.status_code || 200).json(responseData);
          logs = { client: clientIp, endpoint: endpointPath, request_data: requestData };
        }
      } catch (err) {
        exitCode = 1;
        logs = { client: clientIp, error: err.message, status_code: 400, request_data: requestData };
        res.status(400).json(`Cannot get /${endpointPath}`);
      }
    } else {
      res.status(400).json(`Cannot get /${endpointPath}`);
      logs = { client: clientIp, error: `Cannot get /${endpointPath}`, status_code: 400, request_data: requestData };
    }

    elapsedTime = metrics.TimerStop(id);
    await connectToDatabase();
    await entryMetrics('public_api', startTime, elapsedTime, exitCode, JSON.stringify(logs));
  } catch (err) {
    logs = { client: null, error: err.message, status_code: 500, request_data: null };
    elapsedTime = metrics.TimerStop(id);
    await connectToDatabase();
    await entryMetrics('public_api', startTime, elapsedTime, exitCode, JSON.stringify(logs));
    res.status(500).json('Internal Server Error');
  }
}

async function connectToDatabase() {
  try {
    await db_bellafiora.authenticate();
  } catch (err) {
    console.error(err);
  }
}

async function entryMetrics(app, start, time, exit, logs) {
  const transaction = await db_bellafiora.transaction();
  try {
    await AppMetric.sync();
    const finalLogs = JSON.stringify(logs);
    const log = JSON.parse(finalLogs);
    await AppMetric.create({ app, start, time, exit, log }, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.error(err);
  }
}


// api/public/get_beatmap
// int: beatmap_id | mandatory | Accepcté: int entre 1 et 6 000 000

// api/public/get_beatmapset 
// int: beatmapset_id | mandatory | Accepcté: int entre 1 et 6 000 000

// api/public/get_skillset
// int: beatmap_id | mandatory | Accepcté: int entre 1 et 6 000 000

// api/public/get_batmap_sort
// float: min_od | Accepcté: float entre 0.1 et 10
// float: max_od | Accepcté: float entre 0.1 et 10
// float: min_cs | Accepcté: float entre 0.1 et 10
// float: max_cs | Accepcté: float entre 0.1 et 10
// float: min_hp | Accepcté: float entre 0.1 et 10
// float: max_hp | Accepcté: float entre 0.1 et 10
// float: min_sr | Accepcté: float entre 0.1 et 20
// float: max_sr | Accepcté: float entre 0.1 et 20
// int: min_lenght | Accepcté: int entre 1 et 10000
// int: max_lenght | Accepcté: float entre 1 et 10000
// string: [skillset] (liste séparée par des virgules)
// string: [status] (liste séparée par des virgules) | Accepcté: graveyard ou/et ranked ou/et loved ou/et qualified ou/et approved 
// int: max_sort | accepté: entre 1 et 1000
// string: order_by | accepté: asc ou desc






// api/private/process_command
// string: command | mandatory
// int: ts | mandatory
// string: user | mandatory
// string: token | mandatory

// api/private/login
// string: login | mandatory
// string: password | mandatory
// int: ts | mandatory
// string: ip | mandatory
// string: token | mandatory
// string: host | mandatory

// api/private/logout
// string: login | mandatory
// string: password | mandatory
// int: ts | mandatory
// string: ip | mandatory
// string: token | mandatory
// string: host | mandatory

// api/private/user_manager
// int: action | mandatory
// json: filters | mandatory

// api/private/history
// api/private/prompt_generate
// api/private/get_beatmap
// api/private/get_beatmapset
// api/private/get_user
// api/private/delete_user
// api/private/create_user
