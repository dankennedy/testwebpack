'use strict';

var Booking = require('server/models/booking'),
    eventer = require('server/events'),
    https = require('https'),
    qs = require('querystring'),
    Promise = require('bluebird');

module.exports = function(router, log) {

    var mdl = {};

    log.debug('ipn: initialising');

    router.post('/ipn/', mdl.verify);

    mdl.verify = function(req, res, next) {

        log.info('ipn: Verifying request', req.body);
        verifyP(req.body)
            .then(()  => {
                log.info('ipn: Verification succeeded');

                if ((req.body.payment_status || '').toLowerCase() !== 'completed') {
                    log.info('ipn: Ignoring payment where status is not "completed" but is', req.body.payment_status);
                    return res.sendStatus(200);
                }

                var id = req.body.item_number;
                if (!(/^[0-9a-fA-F]{24}$/).test(id)){
                    log.warn('ipn: Invalid booking id on payment', id);
                    return res.sendStatus(200);
                }

                log.info('ipn: Payment received for booking id', id);
                Booking.findOneAsync({'_id': id})
                    .then(b => {

                        if (!b) {
                            log.warn('ipn: Booking not found', id);
                            return res.sendStatus(200);
                        }

                        applyPaymentToBooking(b, req.body);

                        b.saveAsync()
                            .then(function() {
                                log.info('ipn: Booking updated with payment');
                                return res.sendStatus(200);
                            });
                    });

            })
            .error(err => {
                log.error('ipn:', err);
                return res.sendStatus(500);
            });
    };

    mdl.applyPaymentToBooking = function(b, payment) {

        var amount = parseFloat(payment.mc_gross);
        log.info('ipn: Parsed amount is', amount.toFixed(2));

        if (payment.item_name.indexOf('deposit') > -1) {
            log.info('ipn: Creating deposit payment');
            b.payments.push({
                type: 'deposit',
                amount: amount
            });
            if (amount !== b.deposit) {
                log.warn('ipn: Amount received', amount, 'does not match deposit', b.deposit);
            }
            eventer.depositReceived(b);
        } else if (payment.item_name.indexOf('balance') > -1) {
            log.info('ipn: Creating balance payment');
            b.payments.push({
                type: 'balance',
                amount: amount
            });
            if (amount !== b.price - b.deposit) {
                log.warn('ipn: Amount received', amount, 'does not match balance', b.price - b.deposit);
            }
            eventer.balanceReceived(b);
        } else {
            log.info('ipn: Full amount received. Creating both deposit and balance payments');
            b.payments.push({
                type: 'deposit',
                amount: b.deposit
            });
            b.payments.push({
                type: 'balance',
                amount: b.price - b.deposit
            });
            if (amount !== b.price) {
                log.warn('ipn: Amount received', amount, 'does not match price', b.price);
            }
            b.notes = 'Full amount received by paypal: ' + amount;
            eventer.fullAmountReceived(b);
        }
    };

    mdl.verifyP = function(params) {

        params.cmd = '_notify-validate';

        var body = qs.stringify(params),
            req_options = {
                host: (params.test_ipn) ? 'www.sandbox.paypal.com' : 'www.paypal.com',
                method: 'POST',
                path: '/cgi-bin/webscr',
                headers: {'Content-Length': body.length}
            };

        return new Promise(function (resolve, reject) {

            return mdl.requestP(req_options, body)
                .then(res => {
                    if (res === 'VERIFIED')
                        return resolve();
                    else
                        return reject(new Error('ipn: Response was not "VERIFIED" but was ' + res));
                })
                .catch(err => reject(err));
        });
    };

    mdl.requestP = function(options, body) {
        return new Promise(function (resolve, reject) {
            log.info('ipn: Making', options.method, 'request to', options.host, options.path);

            var req = https.request(options, function(res) {
                var data = [];

                res.on('data', function(d) {
                    data.push(d);
                });

                res.on('end', function() {
                    var result = data.join('');
                    log.info('ipn: HTTPS succeeded', result);
                    return resolve(result);
                });

                req.on('error', function(err) {
                    log.warn('ipn: HTTPS request failed', err);
                    return reject(err);
                });
            });

            req.write(body);
            req.end();
        });
    };

    return mdl;
};


