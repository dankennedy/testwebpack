'use strict';
var log       = require('server/log');

module.exports = function(api, config) {
  log.debug('api.bookings: initialising');

  api.get('/bookings/', listBookings);
  api.post('/bookings/', createBooking);

  function listBookings(req, res, next) {
    res.status(200).json([{'id':'1'},{'id':'2'},{'id':'3'}]);
  }

  function createBooking(req, res, next) {
    res.status(201).json({'id': '123'});
  }
};
