const express = require('express');
const routes = require('./routes');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const Metrics = require('./Metrics/Modules/Metrics');
const test = require('baerertest');

const fs = require('fs').promises
const envFile = '/common/env/.env';
dotenv.config({ path: envFile });

const api = express();
const port = 25586;

api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/client/*', ClientAPI);
// api.get('/api/v1/*', PublicAPI)

// Function for handling client API requests
async function ClientAPI(i, o) {
    // const metrics = new Metrics();
    // let startTime = metrics.getDate();
    // metrics.TimerStart(startTime);

    // Initialize logs and exitCode
    let logs = {};
    let exitCode = 0;

    // Extract route name from the request path
    const routeName = i.path.split('/')[3];
    // Find the route information in the predefined routes array
    const routeFind = routes.find(e => e.name === routeName);
    // Declare variables for status code and response
    let statusCode;
    let response;

    // Check if the route is found
    if (routeFind) {
        // Construct the path to the route file
        const routePath = path.join(__dirname, 'routes', 'private', `${routeFind.name}.js`);
        // Check if the route file exists
        await fs.access(routePath);
        // Require the route file
        const route = require(routePath);
        // Check if the route is private and passes the test function
        if (routeFind.type === "private" && test(i)) {
            try {
                // Call the Static function of the route for processing
                response = await route.Static(i);
                statusCode = 200;
                // Update logs for successful request
                logs = {
                    client: i.query.idApp || null,
                    error: null,
                };
            } catch (error) {
                // Handle errors during route processing
                statusCode = 500;
                response = { error: 'The request has an error' };
                exitCode = 1;
                // Update logs for failed request
                logs = {
                    client: i.query.idApp || null,
                    error: response.error,
                };
            }
        } else if(routeFind.type === "public" && testKey(i)){
            try {
                // Call the Static function of the route for processing
                response = await route.Static(i);
                statusCode = 200;
                // Update logs for successful request
                logs = {
                    client: i.query.idApp || null,
                    error: null,
                };
            } catch (error) {
                // Handle errors during route processing
                statusCode = 500;
                response = { error: 'The request has an error' };
                exitCode = 1;
                // Update logs for failed request
                logs = {
                    client: i.query.idApp || null,
                    error: response.error,
                };
            }
        } else {
            // Handle cases where route is not private or test fails
            statusCode = 504;
            response = { error: 'Basic Authentication' };
            // Update logs for authentication failure
            logs = {
                client: i.query.idApp || null,
                error: response.error,
            };
        }
    } else {
        // Handle cases where route is not found
        statusCode = 400;
        response = { error: `Cannot GET /${routeName}` };
        // Update logs for invalid route
        logs = {
            client: i.query.idApp || null,
            error: response.error,
        };
    }

    // Set response headers and send the response
    o.setHeader('Content-Type', 'application/json');
    o.status(statusCode).json(response);

 
    // Additional code for metrics, database connection, and logging can be uncommented as needed
    // ...

    // Note: Uncomment the code below for additional functionality
    // let elapsedTime = metrics.TimerStop(startTime);
    // await connectToDatabase();
    // logs.statusCode = statusCode;
    // await entryMetrics('public_api', startTime, elapsedTime, exitCode, JSON.stringify(logs));
}
// API listening on the specified port
api.listen(port);
