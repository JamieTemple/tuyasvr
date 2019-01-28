var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    moment = require('moment'),
    logger = require('./logger');

logger.initialize("tuyasvr", true, 'Server started on port ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static('public'));

var routes = require('./api/routes/tuyapiRoutes');
routes(app);

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

var server = app.listen(port);

// -------------------------------------------------------------------------------
// App terminated, so clean up before we leave...
function gracefulShutdown() {
    logger.log('Clean shutdown in progress...');
    server.close();
}

// -------------------------------------------------------------------------------
// Capture and deal with termination signals...
process.once('SIGUSR2', function () {
    gracefulShutdown(function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});