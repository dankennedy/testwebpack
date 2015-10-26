'use strict';

import _ from 'lodash';
import moment from 'moment';

export class BookingUtils {

    static hasConflicts(b, exist) {
        if (!b || !exist || !exist.length)
          return false;

        let booking = new Booking(b);
        return _.some(exist, function(el) {
            let comp = new Booking(el);
            return (booking.getArrivalDate() < comp.getArrivalDate() && booking.getDepartureDate() > comp.getArrivalDate()) ||
                   (comp.getArrivalDate() < booking.getArrivalDate() && comp.getDepartureDate() > booking.getArrivalDate());
        });
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
            .hours(14);
  }

  getDepartureDate() {
    return moment(this.b.arrivalDate)
            .add(this.b.numberOfNights, 'days')
            .hours(10);
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
