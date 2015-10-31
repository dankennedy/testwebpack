'use strict';

var events = require('events'),
    util = require('util'),
    email = require('server/emails'),
    log = require('server/log');

var Eventer = function() {

    events.EventEmitter.call(this);

    this.bookingMade = function(booking) {
        this.emit('bookingMade', booking);
    };

    this.depositReceived = function(booking) {
        this.emit('depositReceived', booking);
    };

    this.balanceReceived = function(booking) {
        this.emit('balanceReceived', booking);
    };

    this.fullAmountReceived = function(booking) {
        this.emit('fullAmountReceived', booking);
    };
};

util.inherits(Eventer, events.EventEmitter);

var Listener = function() {
    this.bookingMadeHandler = function(data) {
        log.info('Booking made event handler');
        email.sendBookingMadeEmail(data, function() {});
    };
    this.depositReceivedHandler = function(data) {
        log.info('Deposit received event handler');
        email.sendDepositReceivedEmail(data, function() {});
    };
    this.balanceReceivedHandler = function(data) {
        log.info('Balance received event handler');
        email.sendBalanceReceivedEmail(data, function() {});
    };
    this.fullAmountReceivedHandler = function(data) {
        log.info('Full payment received event handler');
        email.sendFullAmountReceivedEmail(data, function() {});
    };
};

var eventer = new Eventer();
var listener = new Listener(eventer);
eventer.on('bookingMade', listener.bookingMadeHandler);
eventer.on('depositReceived', listener.depositReceivedHandler);
eventer.on('balanceReceived', listener.balanceReceivedHandler);
eventer.on('fullAmountReceived', listener.fullAmountReceivedHandler);

module.exports = eventer;
