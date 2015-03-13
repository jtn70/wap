var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('favicon');
var logger = require('morgan');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var config = require('./config.json');

var app = express();

// View engine is handled by the client.
// JSON data is sent with the response


if (config.logto == "stdout" && config.logging === true) {
    app.use(logger('dev'));     // Log is written to STDOUT
    console.log("Web Application Server starting........");
    console.log("Logging to STDOUT");
    if (config.development === true) {
        console.log("Development mode");
    }
}

// app.use(favicon(__dirnname + 'favicon.ico'));
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/html')));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/html');
});

app.post('/', function(req, res) {
    res.send("POST request not implemented.");
});

app.put('/', function(req, res) {
    res.send("PUT request not implemented.");
});

app.delete('/', function(req, res) {
    res.send("DELETE request not implemented.");
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// Error Handlers

// Development error handler
if (config.development === true) {
    app.use (function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('Error: ' + err.message + "  (" + err + ")");
    });
}

// Production error handler
// No stacktrace leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error:' + err.message);
});

if (config.logto == "stdout" && config.logging === true) {
    console.log("Intended application port: " + config.port);
}
var port = normalizePort(config.port || '3000');
app.set('port', port);

// Create http server
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Event listener for HTTP server "error" event
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

     // Handle specific listen errors with friendly messages
     switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
     }
}

// Event listener for HTTP server 'listening event'
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}
