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
const socketIO = require('socket.io');
const crypto = require('crypto');


const test = require('baerertest')
const fs = require('fs').promises
const envFile = '/common/env/.env';
dotenv.config({ path: envFile });


const app = express();
const port = 25586;
const wsPort = 25587;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/client/*', requestHandler);

async function requestHandler(req, res) {

    const endpointPath = req.path.split('/')[3];
    const endpoint = endpoints.find(e => e.name === endpointPath);
    
    if(endpoint){
        
        const filePath = path.join(__dirname, 'endpoint', `${endpoint.type}` ,`${endpoint.name}.js`);
        await fs.access(filePath);
        const route = require(filePath);
        if(endpoint.type === "private" && req.headers.authorization && test(req.headers.authorization.split(' ')[1])){
            try {    
                await route.handleRequest(req.query).then(data => {
                    res.status(200).json(data);
                });
                
            } catch (error) {
                console.error('The request has an error', error);
                res.status(500).json({ error: 'The request has an error' });
            }
        } else if(endpoint.type === "public" && test(req.query.k)){
            try {    
                const data = await route.handleRequest(req.query);
                res.status(200).json(data);
            } catch (error) {
                console.error('The request has an error:', error);
                res.status(500).json({ error: 'The request has an error' });
            }
        } else {
            res.status(500).json({ error: 'Basic Autentification' });
        }
    } else {
        res.status(400).json({ error: `Cannot GET /${endpointPath}` });
    }  
}
app.listen(port);

// const io = socketIO(app).listen(wsPort);
// io.on('connection', (socket) => {
//     socket.on('validation', (cle) => {
//         if (test(cle)) {
//             socket.emit('validation', true);

//             socket.on('message', (aesContent, client) => {
//                 const decipher = crypto.createDecipher('aes-256-cbc', process.env.wsaes);
//                 let content = decipher.update(aesContent, 'hex', 'utf-8');
//                 content += decipher.final('utf-8');

//                 io.to(client).emit('message', content);
//             });
//         } else {
//             socket.emit('validation', false);
//             socket.disconnect();
//         }
//     });
// });


