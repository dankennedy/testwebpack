'use strict';

var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? 8080 : 3001;
var publicPath = path.resolve(__dirname, 'public');
var config = require('server/config');

process.env.TZ = 'UTC';

app.use(express.static(publicPath));

var log = require('server/log');
app.use(function(req, res, next) {
  var startTime = process.hrtime();

  next();

  var url = (req.baseUrl || '') + (req.url || '-'),
      hrtime = process.hrtime(startTime),
      responseTime = hrtime[0] * 1e3 + hrtime[1] / 1e6;

  log.info(req.method + ':' + url + ' - ' + responseTime);
});

require('server/router')(app, config);
app.use(log.errorLog());

if (!isProduction) {

    var bundle = require('server/makebundle');
    bundle(log);

    // Any requests to localhost:3000/build are proxied
    // to webpack-dev-server
    app.all('/build/*', function(req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });

}

app.use(fileNotFound);

var db = require('server/db')(process.env, log);
db.startup();

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function() {
    log.error('server: Could not connect to proxy, please try again...');
});

app.listen(port, function() {
  log.info('server: Listening on port %d in %s mode', port, app.get('env'));
  log.info('server: Nodejs version ' + process.version);
});

process.on('uncaughtException', function(err) {
    log.error(err);
});

function fileNotFound(req, res) {
  log.info('server: File not found "%s"', req.originalUrl);
  res.status(404).send('Page not found');
}
