'use strict';

import _ from 'lodash';
import moment from 'moment';

export class BookingUtils {

    static hasConflicts(b, exist) {

        if (!b || !exist || !exist.length)
          return false;

        return new Booking(b).hasConflicts(exist);
    }

    static getSummaryDescription(b) {
      return new Booking(b).getSummaryDescription();
    }

    static getDateState(dt, exist) {
        let state = {isArrivalDay:false, isDepartureDay:false, isBusyDate:false};
        if (!dt || !exist || !exist.length)
          return state;

        _.forEach(exist, function(b) {

            let arrives = b.getArrivalDate(),
                departs = b.getDepartureDate();

            if (arrives.isSame(dt, 'day'))
                state.isArrivalDay = true;
            else if (departs.isSame(dt, 'day'))
                state.isDepartureDay = true;
            else if (arrives.isBefore(dt, 'day') && departs.isAfter(dt, 'day'))
                state.isBusyDate = true;
        });
        return state;
    }
}


export class Booking {

    constructor(booking) {
        this.summaryDescriptionTemplate = _.template('Arriving after <%= arrivalTime %> on <%= longArrivalDate %> ' +
          'staying for <%= numberOfNights %> nights. ' +
          'Leaving before <%= departureTime %> on <%= longDepartureDate %>.');
        _.extend(this, booking);
    }

    getArrivalDate() {
        return moment(this.arrivalDate)
                .hours(14)
                .minutes(0)
                .seconds(0);
    }

    getDepartureDate() {
        return moment(this.arrivalDate)
                .add(this.numberOfNights, 'days')
                .hours(10)
                .minutes(30)
                .seconds(0);
    }

    getCreatedDate() {
        return this.createdDate ? moment(this.createdDate) : moment();
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
        if (!this.payments)
            return null;

        return _.find(this.payments, function(p) {
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
        if (!this.payments)
            return 0;

        return _.sum(this.payments, function(p) {
            return p.amount;
        });
    }

    getBalanceOutstanding() {
        let amount = (this.price ? this.price : 0) - this.getTotalPayments();
        return amount < 0 ? 0 : amount;
    }

    isDepositPaid() {
        return this.getDepositPayment() && true;
    }

    isBalancePaid() {
        return this.getBalanceOutstanding() === 0 && this.getBalancePayment() !== null;
    }

    isFullyPaid() {
        return this.getBalanceOutstanding() === 0;
    }

    hasUsedVoucher() {
        return this.voucher && this.voucher._id.length;
    }

    getBalance() {
        if (!this.price)
            return 0;

        return this.price - (this.deposit || 0);
    }

    getSummaryDescription() {
        if (!this.arrivalDate || !moment(this.arrivalDate).isValid())
            return '';

        return this.summaryDescriptionTemplate({
            arrivalTime: this.getArrivalDate().format('ha'),
            departureTime: this.getDepartureDate().format('h:ma'),
            longArrivalDate: this.getArrivalDate().format('dddd Do MMMM'),
            longDepartureDate: this.getDepartureDate().format('dddd Do MMMM'),
            numberOfNights: this.numberOfNights
        });
    }

    hasConflicts(exist) {
        let arriving = this.getArrivalDate(),
            leaving = this.getDepartureDate();

        return _.some(exist, function(el) {
            let comp = new Booking(el);

            return  arriving.isSame(comp.getArrivalDate(), 'day') ||
                    leaving.isSame(comp.getDepartureDate(), 'day') ||
                    (arriving.isBefore(comp.getArrivalDate()) && leaving.isAfter(comp.getArrivalDate())) ||
                    (comp.getArrivalDate().isBefore(arriving) && comp.getDepartureDate().isAfter(arriving));
        });

    }
}
