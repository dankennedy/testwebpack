'use strict';
var log = require('server/log'),
    Booking = require('server/models/booking'),
    moment = require('moment');

module.exports = function(api, config) {
    log.debug('api.bookings: initialising');

    api.get('/bookings/', listBookings);
    api.post('/bookings/', createBooking);

    function listBookings(req, res, next) {

        var since = moment();
        if(req.query.since && moment(req.query.since).isValid())
            since = moment(req.query.since);

        Booking.find(
            {'arrivalDate': {'$gte': since}},
            {_id: 0, arrivalDate: 1, numberOfNights: 1},
            function(err, bookings) {
                if (err) return res.status(500).send(err);
                res.json(bookings);
            });
    }

    function createBooking(req, res, next) {
        // var newBooking = new Booking(req.body);


        res.status(201).json({
            'id': '123'
        });
    }
};
