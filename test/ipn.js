'use strict';

import assert from 'assert';
var log = require('server/log'),
    ipn = require('server/ipn')({post: function() {}}, log);

suite('IPN', function() {

    test('Promise based https request succeeds', function(done) {
        var request = {
            host: 'www.google.co.uk',
            method: 'GET',
            path: ''
        };

        ipn.requestP(request, '')
            .then(() => assert(true))
            .catch(err => assert(false, err))
            .finally(() => done());
    });

    test('applyPaymentToBooking creates expected model', function() {
        getPaymentTestCases().forEach(function(tc) {
            let b = {
                payments: [],
                deposit: 100,
                price: 300
            };
            ipn.applyPaymentToBooking(b, tc.payment);

            assert.equal(b.payments.length, tc.exp_types.length);
            tc.exp_types.forEach(function(p, i) {
                assert.equal(b.payments[i].amount, tc.exp_amounts[i]);
                assert.equal(b.payments[i].type, tc.exp_types[i]);
            });
        });
    });

    test('verifyP sends request to Paypal but gets rejected', function(done) {
        var params = {test_ipn: true};
        ipn.verifyP(params)
            .then(() => assert(false))
            .catch(err => {
                assert.equal(err, 'Error: ipn: Response was not "VERIFIED" but was INVALID');
            })
            .finally(() => done());
    });

    function getPaymentTestCases() {
        return [{
            exp_types: ['deposit'],
            exp_amounts: [100],
            payment: {
                item_name: 'Thimble cottage deposit',
                mc_gross: 100
            }
        }, {
            exp_types: ['balance'],
            exp_amounts: [200],
            payment: {
                item_name: 'Thimble cottage balance',
                mc_gross: 200
            }
        }, {
            exp_types: ['deposit', 'balance'],
            exp_amounts: [100, 200],
            payment: {
                item_name: 'Thimble cottage full amount',
                mc_gross: 300
            }
        }];
    }
});
