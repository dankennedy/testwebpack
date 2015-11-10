'use strict';
var mongoose = require('mongoose');

var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

module.exports = function(config, log) {

    var db = {};

    db.startup = function() {

        mongoose.connection.on('open', function() {
            log.info('db: Connected to MongoDB successfully!');
        });

        mongoose.connection.on('error', function(err) {
            log.error('db: Failed to connect to MongoDB');
            log.error(err);
        });


        var options = {
            db: {
                retryMilliseconds: 5000,
                numberOfRetries: 360000
            },
            server: {
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 5000
                },
                auto_reconnect: true
            }
        };

        log.info('db: Connecting to ' + config.env + ' instance');

        if (!config.isProduction) {
            mongoose.connect('db', 'tcwhitby', options);
        } else {
            mongoose.connect('mongodb://' + config.dbUser + ':' + config.dbPwd + '@ds057538.mongolab.com:57538/tcwhitby', options);
        }

    };

    db.closeDB = function() {
        mongoose.disconnect();
    };

    return db;
};
