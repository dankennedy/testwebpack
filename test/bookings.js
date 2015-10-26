'use strict';

import assert from 'assert';
import { Booking, BookingUtils } from 'shared/bookings.js';
import moment from 'moment';

suite('Booking Utils', function() {

    suite('hasConflicts', function() {

        test('should return false for null booking', function() {
            assert.equal(false, BookingUtils.hasConflicts(null, []));
        });

        test('should return false for null entries', function() {
            assert.equal(false, BookingUtils.hasConflicts({}, null));
        });

        test('should return true for booking starting before existing', function() {
            assert.equal(true, BookingUtils.hasConflicts(
                {arrivalDate: new Date(2015, 0, 31), numberOfNights: 3},
                getExistingBookings()
            ));
        });

        test('should return true for booking starting during existing', function() {
            assert.equal(true, BookingUtils.hasConflicts(
                {arrivalDate: new Date(2015, 1, 2), numberOfNights: 3},
                getExistingBookings()
            ));
        });

        test('should return false for booking starting after existing', function() {
            assert.equal(false, BookingUtils.hasConflicts(
                {arrivalDate: new Date(2015, 1, 5), numberOfNights: 3},
                getExistingBookings()
            ));
        });

    });

    suite('Booking', function() {

        test('should use numberOfNights and arrivalDate to calculate departureDate', function() {
            assert(moment(new Date(2015, 0, 4, 10))
                .isSame(new Booking({arrivalDate: new Date(2015, 0, 1), numberOfNights: 3}).getDepartureDate()));
        });

        test('should use numberOfNights and arrivalDate to calculate departureDate (feb crossover)', function() {
            assert(moment(new Date(2015, 2, 2, 10))
                .isSame(new Booking({arrivalDate: new Date(2015, 1, 25), numberOfNights: 5}).getDepartureDate()));
        });

        test('should set arrivalDate hours to 14', function() {
            assert(moment(new Date(2015, 0, 1, 14))
                .isSame(new Booking({arrivalDate: new Date(2015, 0, 1)}).getArrivalDate()));
        });

        test('should use template and dates to create getSummaryDescription', function() {
            assert.equal(new Booking({arrivalDate: new Date(2015, 3, 14), numberOfNights: 5}).getSummaryDescription(),
                'Arriving after 2pm on Tuesday 14th April staying for 5 nights. Leaving before 10am on Sunday 19th April.'
                );
        });

    });
    function getExistingBookings() {
        var bookings = [];
        for (var i = 0; i < 10; i++) {
            bookings.push({arrivalDate: new Date(2015, i, 1), numberOfNights: 4});
        };
        return bookings;
    }

});
