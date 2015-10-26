'use strict';
var mongoose = require('mongoose');

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

        if ('development' === (env.NODE_ENV || 'development')) {
            // mongoose.connect('mongodb', 'tcwhitby', options);
            mongoose.connect('mongodb://' + env.DBUSR + ':' + env.DBPWD + '@ds057538.mongolab.com:57538/tcwhitby', options);
        }

        if ('production' === env.NODE_ENV) {
            log.info('db: Connecting to ' + env.NODE_ENV + ' instance');
            mongoose.connect('mongodb://' + env.DBUSR + ':' + env.DBPWD + '@ds057538.mongolab.com:57538/tcwhitby', options);
        }
    };

    db.closeDB = function() {
        mongoose.disconnect();
    };

    return db;
};
