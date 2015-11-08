'use strict';

require('babel/register');

var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    config = require('server/config'),
    hbs = require('express-handlebars'),
    path = require('path');

process.env.TZ = 'UTC';
app.engine('tmpl', hbs({
  partialsDir: path.resolve('./views')
}));
app.set('view engine', 'tmpl');
app.set('views', config.isProduction ? config.publicPath : path.resolve('./views'));

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(config.publicPath));

var log = require('server/log');

app.use(function(req, res, next) {
    var startTime = process.hrtime();

    next();

    var url = (req.baseUrl || '') + (req.url || '-'),
        hrtime = process.hrtime(startTime),
        responseTime = hrtime[0] * 1e3 + hrtime[1] / 1e6;

    log.info(req.method + ':' + url + ' - ' + responseTime);
});

app.use(log.errorLog());

if (!config.isProduction) {

    var bundle = require('server/makebundle');
    bundle(log, config);

    var httpProxy = require('http-proxy');
    var proxy = httpProxy.createProxyServer();

    // It is important to catch any errors from the proxy or the
    // server will crash. An example of this is connecting to the
    // server when webpack is bundling
    proxy.on('error', function() {
        log.error('server: Could not connect to proxy, please try again...');
    });

    // Any requests to localhost:3001/build are proxied
    // to webpack-dev-server
    app.all('/build/*', function(req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });
}

require('server/router')(app, config);

app.use(fileNotFound);

var db = require('server/db')(config, log);
db.startup();

app.listen(config.port, function() {
    log.info('server: Listening on port %d in %s mode', config.port, app.get('env'));
    log.info('server: Nodejs version ' + process.version);
});

process.on('uncaughtException', function(err) {
    log.error(err);
});

function fileNotFound(req, res) {
    log.warn('server: File not found "%s"', req.originalUrl);
    res.sendStatus(404);
}
