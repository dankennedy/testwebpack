'use strict';

var express = require('express'),
    log = require('server/log'),
    api = require('server/api');

import React from 'react/addons';
import Router from 'react-router';
import routes from 'client/routes';

module.exports = function(app, config) {

    app.use('/api/', api(express.Router(), config)); // eslint-disable-line new-cap
    app.use(function router(req, res, next) {
        var context = {
            routes: routes,
            location: req.url
        };
        log.info('router: Requesting', req.url);

        Router.create(context).run(function ran(Handler, state) {
            res.render(config.isProduction ? 'index' : 'development', {
                reactHtml: React.renderToString(<Handler />)
            });
        });
    });
};
