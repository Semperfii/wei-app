const http = require('http');
const app = require('./app');
const debug = require('debug')('node-angular');

const port = process.env.PORT || 3000;

app.set('port', port); 
const server = http.createServer(app);

