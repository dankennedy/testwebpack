'use strict';
var mongoose = require('mongoose');

var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

module.exports = function(env, log) {

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

        log.info('db: Connecting to ' + env.NODE_ENV + ' instance');

        if ('development' === (env.NODE_ENV || 'development')) {
            mongoose.connect('localhost', 'tcwhitby', options);
        }

        if ('production' === env.NODE_ENV) {
            mongoose.connect('mongodb://' + env.DBUSR + ':' + env.DBPWD + '@ds057538.mongolab.com:57538/tcwhitby', options);
        }
    };

    db.closeDB = function() {
        mongoose.disconnect();
    };

    return db;
};
