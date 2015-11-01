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
            assert(moment(new Date(2015, 0, 4, 10, 30))
                .isSame(new Booking({arrivalDate: new Date(2015, 0, 1), numberOfNights: 3}).getDepartureDate()));
        });

        test('should use numberOfNights and arrivalDate to calculate departureDate (feb crossover)', function() {
            assert(moment(new Date(2015, 2, 2, 10, 30))
                .isSame(new Booking({arrivalDate: new Date(2015, 1, 25), numberOfNights: 5}).getDepartureDate()));
        });

        test('should set arrivalDate hours to 14', function() {
            assert(moment(new Date(2015, 0, 1, 14))
                .isSame(new Booking({arrivalDate: new Date(2015, 0, 1)}).getArrivalDate()));
        });

        test('should use template and dates to create getSummaryDescription', function() {
            assert.equal(new Booking({arrivalDate: new Date(2015, 3, 14), numberOfNights: 5}).getSummaryDescription(),
                'Arriving after 2pm on Tuesday 14th April staying for 5 nights. Leaving before 10:30am on Sunday 19th April.'
                );
        });

        test('should default created date to now', function() {
            assert(moment().isSame(new Booking().getCreatedDate(), 'minute'));
        });

        test('should default deposit due date to now', function() {
            assert(moment().isSame(new Booking().getDepositDueDate(), 'minute'));
        });

        test('should calculate balance due date for 6 weeks before arrival date', function() {
            let balanceDueDate = new Booking({
                    createdDate: new Date(2015, 1, 1),
                    arrivalDate: new Date(2015, 9, 26),
                }).getBalanceDueDate(),
                expected = moment(new Date(2015, 8, 14));

            assert(expected.isSame(balanceDueDate, 'day'),
                `expected ${expected.format('YYYY-MM-DD')} but got ${balanceDueDate.format('YYYY-MM-DD')}`);
        });

        test('getDepositPayment uses type to filter', function() {
            assert.deepEqual(getBookingWithPayments().getDepositPayment(), {type: 'deposit', amount: 20});
        });

        test('getBalancePayment uses type to filter', function() {
            assert.deepEqual(getBookingWithPayments().getBalancePayment(), {type: 'balance', amount: 10});
        });

        test('getTotalPayments sums amounts', function() {
            assert.equal(getBookingWithPayments().getTotalPayments(), 30);
        });

        test('getBalanceOutstanding substracts payments from price', function() {
            assert.equal(getBookingWithPayments(50).getBalanceOutstanding(), 20);
        });

        test('isDepositPaid checks for deposit exists', function() {
            assert(getBookingWithPayments().isDepositPaid());
        });

        test('isDepositPaid checks for deposit', function() {
            assert(!new Booking().isDepositPaid());
        });

        test('isBalancePaid checks for balance exists', function() {
            assert(getBookingWithPayments().isBalancePaid());
        });

        test('isBalancePaid checks for balance', function() {
            assert(!new Booking().isBalancePaid());
        });

        test('isFullyPaid checks for both payments exists', function() {
            assert(getBookingWithPayments().isFullyPaid());
        });

        test('isFullyPaid checks for both payments', function() {
            assert(!new Booking({price: 10}).isFullyPaid());
        });

        test('hasUsedVoucher checks for voucher exists', function() {
            assert(new Booking({voucher: {_id: 'test'}}).hasUsedVoucher());
        });

        test('hasUsedVoucher checks for voucher', function() {
            assert(!new Booking().hasUsedVoucher());
        });

        test('getBalance checks for voucher', function() {
            assert.equal(getBookingWithPayments(50, 20).getBalance(), 30);
        });
    });

    function getExistingBookings() {
        var bookings = [];
        for (var i = 0; i < 10; i++) {
            bookings.push({arrivalDate: new Date(2015, i, 1), numberOfNights: 4});
        };
        return bookings;
    }

    function getBookingWithPayments(price, deposit) {
        return new Booking({price: price, deposit: deposit, payments: [
                {type: 'balance', amount: 10},
                {type: 'deposit', amount: 20}
                ]});
    }
});
