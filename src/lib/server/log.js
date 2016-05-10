'use strict';

var bunyan = require('bunyan'),
    config = require('server/config').logging,
    PrettyStream = require('bunyan-prettystream'),
    LogstashStream = require('bunyan-logstash-tcp');

var stdout = new PrettyStream({ mode: 'dev' });
stdout.pipe(process.stdout);

let streams = [{ level: config.stdout || config.level, type: 'raw', stream: stdout }];

if (config.logstash) {
    let outStream = LogstashStream.createStream({
        host: config.logstash.host,
        port: config.logstash.port,
        ssl_enable: true,
        ca: [config.logstash.ca_file],
        name: 'tcwhitby',
        tags: config.logstash.tags,
    });

    outStream.on('connect', function() {
    });
    outStream.on('error', function(e) {
        console.log('ERROR: ', e);
    });
    outStream.on('timeout', function() {
        console.log('WARN : Logstash stream timed out');
    });

    streams.push({ type: 'raw', stream: outStream });
}

var logger = bunyan.createLogger({
    name: 'logger',
    level: config.level,
    streams: streams
});

module.exports = logger;

logger.errorLog = function() {
    return require('express-bunyan-logger').errorLogger({
        name: 'error',
        streams: [
            { type: 'raw', stream: stdout }
        ]
    });
};
