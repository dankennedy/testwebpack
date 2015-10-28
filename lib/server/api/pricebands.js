'use strict';
var log = require('server/log'),
    PriceBand = require('server/models/priceband'),
    moment = require('moment');

import {DateUtils}  from 'shared/dates';

module.exports = function(api, config) {
    log.debug('api.pricebands: initialising');

    api.get('/pricebands/', listPricebands);

    function listPricebands(req, res, next) {

        var since = moment().startOf('month');
        if(req.query.since && moment(req.query.since).isValid())
            since = moment(req.query.since);

        PriceBand.find(
            {fromDate: {'$gte': since}},
            {fromDate: 1, toDate: 1, price: 1, _id: 0, numberOfNights: 1},
            {sort: { fromDate: 1, numberOfNights: 1}},
            function(err, data) {
                var results = {};
                results[since.format('YYYY')] = [];
                results[since.add(1, 'years').format('YYYY')] = [];

                data.forEach(function(el) {
                    results[el.fromDate.getFullYear().toString()].push({
                        monthname: DateUtils.getPriceBandMonthName(el.fromDate),
                        price: '£' + el.price,
                    });
                });

                res.json(results);
            });
    }

};
