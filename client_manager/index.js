const express = require('express');
const endpoints = require('./endpoints');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const Metrics = require('./Metrics/Modules/Metrics');
const { AppMetric, User } = require('/common/ressources/SequelizeShemas');
const db_bellafiora = require('./src/sequelize');
const test = require('baerertest')
const fs = require('fs').promises
const envFile = '/common/env/.env';
dotenv.config({ path : envFile });

const app = express();
const port = 25586;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.get('/client/*', requestHandler);

async function requestHandler(req, res) {
	const endpointPath = req.path.split('/')[3];
	const endpoint = endpoints.find(e => e.name === endpointPath);

	if (endpoint) {
		const filePath = path.join(
			__dirname, 'endpoint', `${endpoint.type}`, `${endpoint.name}.js`);
		if (req.headers.authorization && test(req.headers.authorization.split(' ')[1])) {
			try {
				await fs.access(filePath);
				const endpointHandler = require(filePath);
				const data = await endpointHandler.handleRequest(req.query);
				res.status(200).json(data);
			} catch (error) {
				console.error('Erreur lors de la requête:', error);
				res.status(500).json(
					{ error : 'Erreur lors du traitement de la requête' });
			}
		} else {
			res.status(500).json({ error : 'Basic Autentification' });
		}
	} else {
		res.status(400).json({ error : `Cannot GET /${endpointPath}` });
	}
}
app.listen(port);