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
            .minutes(0)
            .seconds(0);
  }

  getSummaryDescription() {
    if (!this.b.arrivalDate || !moment(this.b.arrivalDate).isValid())
      return '';

    return this.summaryDescriptionTemplate({
      arrivalTime: this.getArrivalDate().format('ha'),
      departureTime: this.getDepartureDate().format('ha'),
      longArrivalDate: this.getArrivalDate().format('dddd Do MMMM'),
      longDepartureDate: this.getDepartureDate().format('dddd Do MMMM'),
      numberOfNights: this.b.numberOfNights
    });
  }
}
