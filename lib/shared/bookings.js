'use strict';

import _ from 'lodash';
import moment from 'moment';

export class BookingUtils {

    static hasConflicts(b, exist) {

        if (!b || !exist || !exist.length)
          return false;

        let booking = new Booking(b);
        // console.log('Booking arrives', booking.getArrivalDate().toISOString(), 'and departs', booking.getDepartureDate().toISOString());

        return _.some(exist, function(el) {
            let comp = new Booking(el);
            // console.log('Comparison arrives', comp.getArrivalDate().toISOString(), 'and departs', comp.getDepartureDate().toISOString());

            return (booking.getArrivalDate().isBefore(comp.getArrivalDate()) && booking.getDepartureDate().isAfter(comp.getArrivalDate())) ||
                   (comp.getArrivalDate().isBefore(booking.getArrivalDate()) && comp.getDepartureDate().isAfter(booking.getArrivalDate()));
        });
    }

    static getSummaryDescription(b) {
      return new Booking(b).getSummaryDescription();
    }

    static getDateState(dt, exist) {
      let state = {isArrivalDay:false, isDepartureDay:false, isBusyDate:false};
        if (!dt || !exist || !exist.length)
          return state;

        _.forEach(exist, function(el) {
            let b = new Booking(el);

            if (b.getArrivalDate().isSame(dt, 'day'))
                state.isArrivalDay = true;

            if (b.getDepartureDate().isSame(dt, 'day'))
                state.isDepartureDay = true;

            if (b.getArrivalDate().isBefore(dt, 'day') && b.getDepartureDate().isAfter(dt, 'day'))
                state.isBusyDate = true;
        });

        return state;
    }
}


export class Booking{

    constructor(booking) {
        this.b = booking;
        this.summaryDescriptionTemplate = _.template('Arriving after <%= arrivalTime %> on <%= longArrivalDate %> ' +
          'staying for <%= numberOfNights %> nights. ' +
          'Leaving before <%= departureTime %> on <%= longDepartureDate %>.');
    }

    getArrivalDate() {
        return moment(this.b.arrivalDate)
                .hours(14)
                .minutes(0)
                .seconds(0);
    }

    getDepartureDate() {
        return moment(this.b.arrivalDate)
                .add(this.b.numberOfNights, 'days')
                .hours(10)
                .minutes(30)
                .seconds(0);
    }

    getCreatedDate() {
        return this.b && this.b.createdDate ? moment(this.b.createdDate) : moment();
    }

    getDepositDueDate() {
        return this.getCreatedDate();
    }

    getBalanceDueDate() {
        let balanceDue = this.getArrivalDate().subtract(6, 'weeks'),
            created = this.getCreatedDate();

        return balanceDue.isBefore(created) ? created : balanceDue;
    }

    getPaymentOfType(t) {
        if (!this.b || !this.b.payments)
            return null;

        return _.find(this.b.payments, function(p) {
            return p.type === t;
        });
    }

    getDepositPayment() {
        return this.getPaymentOfType('deposit');
    }

    getBalancePayment() {
        return this.getPaymentOfType('balance');
    }

    getTotalPayments() {
        if (!this.b || !this.b.payments)
            return 0;

        return _.sum(this.b.payments, function(p) {
            return p.amount;
        });
    }

    getBalanceOutstanding() {
        let amount = (this.b && this.b.price ? this.b.price : 0) - this.getTotalPayments();
        return amount < 0 ? 0 : amount;
    }

    isDepositPaid() {
        return this.getDepositPayment() !== null;
    }

    isBalancePaid() {
        return this.getBalanceOutstanding() === 0 && this.getBalancePayment() !== null;
    }

    isFullyPaid() {
        return this.getBalanceOutstanding() === 0;
    }

    hasUsedVoucher() {
        return this.b && this.b.voucher && this.b.voucher._id.length;
    }

    getBalance() {
        if (!this.b || !this.b.price || !this.b.deposit)
            return 0;

        return this.b.price - this.b.deposit;
    }

    getSummaryDescription() {
        if (!this.b || !this.b.arrivalDate || !moment(this.b.arrivalDate).isValid())
            return '';

        return this.summaryDescriptionTemplate({
            arrivalTime: this.getArrivalDate().format('ha'),
            departureTime: this.getDepartureDate().format('h:ma'),
            longArrivalDate: this.getArrivalDate().format('dddd Do MMMM'),
            longDepartureDate: this.getDepartureDate().format('dddd Do MMMM'),
            numberOfNights: this.b.numberOfNights
        });
    }
}
