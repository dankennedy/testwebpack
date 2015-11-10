'use strict';

var request = require('supertest'),
    app = require('server/server').getApp;

suite('API', function() {

    suite('Bookings', function() {

        test('GET bookings gets subset of fields for bookings starting from today', function(done) {
            request(app)
                .get('/api/bookings')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res) {
                    if (!res.body.length || !res.body[0].arrivalDate || !res.body[0].numberOfNights)
                        throw new Error('Expected at least 1 booking with arrivalDate and numberOfNights but got ' + res.text);
                })
                .end(function(err, res){
                    if (err) return done(err);
                    done();
                });
        });

        test('GET single booking', function(done) {
            request(app)
                .get('/api/bookings/52d937dcacff62664a000024')
                .expect('Content-Type', /json/)
                .expect(200, {
                    '_id' : '52d937dcacff62664a000024',
                    'deposit' : 49,
                    'arrivalDate' : '2014-04-24T00:00:00.000Z',
                    'numberOfNights' : 3,
                    'title' : 'Mrs',
                    'firstname' : 'Bea',
                    'lastname' : 'Firth',
                    'email' : 'morganaclothing@aol.com',
                    'phone' : '',
                    'price' : 195,
                    'payments' : [],
                    'address' : [
                        'Not provided'
                    ],
                    'createdDate' : '2014-01-17T14:02:04.690Z',
                    '__v' : 0
                }, done);
        });

        test('GET price for booking', function(done) {
            request(app)
                .get('/api/bookingprice?arrivalDate=2014-04-05&numberOfNights=3')
                .expect('Content-Type', /json/)
                .expect('Cache-Control', /public/)
                .expect(200, {
                    'price' : 195
                }, done);
        });
    });
});

