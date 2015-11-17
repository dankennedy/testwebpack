'use strict';

var express = require('express'),
    log = require('server/log'),
    api = require('server/api');

import React from 'react';
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import { renderToString } from 'react-dom/server';

import routes from 'client/routes';

module.exports = function(app, config) {

    app.use('/api/', api(express.Router(), config)); // eslint-disable-line new-cap

    require('server/ipn')(app, config);

    app.use(function router(req, res, next) {
        log.info('router: Requesting', req.url);
        let location = createLocation(req.url);

        match({routes, location}, (error, redirectLocation, renderProps) => {

            if (redirectLocation)
                res.redirect( 301, redirectLocation.pathname + redirectLocation.search);
            else if(error)
                res.send(500, error.message);
            else if (renderProps == null)
                res.send(404, 'Not found');
            else
                res.render(config.isProduction ? 'index' : 'development', {
                    reactHtml: renderToString(<RoutingContext {...renderProps} />)
                });

        });
        // Router.create(context).run(function ran(Handler, state) {
        //     res.render(config.isProduction ? 'index' : 'development', {
        //         reactHtml: React.renderToString(<Handler />)
        //     });
        // });
    });
};
