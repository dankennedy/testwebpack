'use strict';
var log = require('server/log'),
    Booking = require('server/models/booking'),
    PriceBand = require('server/models/priceband'),
    Voucher = require('server/models/voucher'),
    moment = require('moment'),
    Promise = require('bluebird'),
    eventer = require('server/events'),
    _  = require('lodash');

import {BookingUtils} from 'shared/bookings';

module.exports = function(api, config) {
    log.debug('api.bookings: initialising');

    api.route('/bookings/')
        .get(listBookings)
        .post(createBooking);

    api.route('/bookings/:id')
        .get(getBooking)
        .put(applyVoucher);

    api.get('/bookings/:id/ical', getiCal);

    api.get('/bookingprice/', getPriceForBooking);

    function listBookings(req, res, next) {

        var since = moment();
        if(req.query.since && moment(req.query.since).isValid())
            since = moment(req.query.since);

        Booking.find(
            {'arrivalDate': {'$gte': since}},
            {_id: 0, arrivalDate: 1, numberOfNights: 1})
        .then(function(bookings) {
            res.set('Cache-Control', 'public, max-age=3600');
            res.json(bookings);
        });
    }

    function createBooking(req, res, next) {
        log.info('api.bookings: Creating booking from request', req.body);

        var b = new Booking(req.body);

        Promise.join(PriceBand.getPriceForBooking(b),
                     Booking.findAsync(
                        {'arrivalDate': {'$gte': b.arrivalDate}},
                        {_id: 0, arrivalDate: 1, numberOfNights: 1}),
            function(price, bookings) {

                b.price = price;
                b.deposit = Math.ceil(b.price * 0.25);

                if (BookingUtils.hasConflicts(b.toObject(), _.map(bookings, function(e) {
                    return e.toObject();
                })))
                    return res.status(409).send('Conflicts with existing bookings');

                log.info('api.bookings: Creating booking', b);
                return b.saveAsync().then(function(data) {
                    log.info('api.bookings: Booking created successfully');
                    eventer.bookingMade(data);
                    return res.status(201).json({id: data._id});
                });

        }).error(function(err){
          log.error('api.bookings: Failed to create booking', err);
          res.status(500).send(err.message);
        });
    }

    function getBooking(req, res, next) {

        log.info('api.bookings: Getting booking', req.params);

        Booking.findOneAsync({'_id': req.params.id})
            .then(function(b) {
                return !b ? res.sendStatus(404) : res.json(b);
            }).error(function(err){
              log.error('api.bookings: Failed to get booking', err);
              res.sendStatus(404);
            });
    }

    function applyVoucher(req, res, next) {
        log.info('api.bookings: Applying voucher from request', req.body);

        Promise.join(Booking.findOneAsync({'_id': req.params.id}),
                     Voucher.findOneAsync({'_id': req.body.voucherCode}),
            function(booking, voucher) {

                if (!booking)
                    return res.status(400).send('Booking not found');
                if (!voucher)
                    return res.status(400).send('Voucher not found');
                if (voucher.booking || voucher.usedDate)
                    return res.status(400).send('Voucher has already been used');

                log.info('api.bookings: Applying voucher', voucher, 'to booking', booking);
                switch (voucher.discountType) {
                    case 'fixedprice':
                        booking.deposit = 0;
                        booking.price = voucher.totalPrice;
                        booking.payments.push({type: 'deposit', amount: 0});
                        break;
                    case 'percentdiscount':
                        booking.price = booking.price - Math.ceil(booking.price * voucher.percentDiscount);
                        break;
                    default:
                        log.info('api.bookings: Unknown voucher discountType: ' + voucher.discountType);
                        return res.status(400).send('Invalid voucher details');
                }

                booking.voucher = {
                    '_id': voucher,
                    'description': voucher.description
                };
                voucher.booking = booking;
                voucher.usedDate = new Date();

                return Promise.join(booking.saveAsync(), voucher.saveAsync(),
                    function(b, v) {
                        log.info('api.bookings: Voucher applied');
                        res.json({voucher: v, booking: b});
                });

        }).error(function(err){
          log.error('api.bookings: Failed to apply voucher', err);
          res.status(500).send(err.message);
        });
    }

    function getiCal(req, res, next) {
        Booking.findOneAsync({'_id': req.params.id})
            .then(function(b) {
                if (!b) return res.sendStatus(404);

                var bookingLink = 'http://www.thimblecottagewhitby.co.uk/app/#/pay/' + b._id,
                    booking = new Booking(b);

                cal.createEvent({
                    start: booking.getArrivalDate(),
                    end: booking.getDepartureDate(),
                    floating: true,
                    summary: 'Thimble Cottage Whitby',
                    description: 'Reference: ' + b._id + '\n' +
                        'Arriving on ' + booking.getArrivalDate().format('dddd Do MMMM') +
                        ' staying for ' + booking.numberOfNights + ' nights\n' +
                        'Total price: £' + booking.price + '\n' +
                        'Link: ' + bookingLink + '\n\n' +
                        'We hope you enjoy your stay',
                    location: '15 Loggerhead Yard, Whitby, North Yorkshire, YO21 1DL',
                    url: bookingLink
                });
                cal.serve(res);

            }).error(function(err){
              log.error('api.bookings: Failed to get ical', err);
              res.status(500).send(err.message);
            });
    }

    function getPriceForBooking(req, res, next) {
        PriceBand.getPriceForBooking(new Booking(req.query))
            .then(function(price) {
                res.set('Cache-Control', 'public, max-age=3600');
                res.json({price: price});
            });
    }
};
