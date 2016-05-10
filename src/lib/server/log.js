'use strict';

var bunyan         = require('bunyan'),
    config         = require('server/config').logging,
    PrettyStream   = require('bunyan-prettystream'),
    LogstashStream = require('bunyan-logstash-tcp');


var stdout = new PrettyStream({mode:'dev'});
stdout.pipe(process.stdout);

let streams = [{ level: config.stdout || config.level, type:'raw', stream: stdout }];
if (config.file) {
  streams.push({ level: config.file, type:'file', path: config.default });
}

var outStream = LogstashStream.createStream({
        host: 'logs.firstcs.co.uk',
        port: 9506,
        ssl_enable: true,
        ca: ['/Users/dan/logstash-forwarder.crt'],
        name: 'tcwhitby'
      });

outStream.on('connect', function() {
    console.log('Connected!');
});
outStream.on('error', function(e) {
    console.log('ERROR: ', e);
});
outStream.on('timeout', function() {
    console.log('WARN : Timed out');
});

streams.push({type: 'raw',stream: outStream});

var logger = bunyan.createLogger({
  name:'logger',
  level: config.level,
  streams: streams
});

process.on('SIGUSR2', function () {
  logger.reopenFileStreams();
});

module.exports = logger;

logger.errorLog = function() {
  return require('express-bunyan-logger').errorLogger({
    name: 'error',
    streams: [
      {type: 'raw', stream: stdout},
      {path: config.error || 'log/error.log' }
    ]
  });
};
