const http = require('http');
const express = require ('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false})); //parses the body that comes from the client

app.use((request, response, next) => {
    console.log('In the middleware!');

});

const server = http.createServer(app);
server.listen(3000);