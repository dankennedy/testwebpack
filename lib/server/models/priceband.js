'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PriceBandSchema = new Schema({
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    numberOfNights: { type: Number, required: true, min: 2 },
    price: { type: Number, required: true, min: 1 }
});

PriceBandSchema.statics.getPriceForBooking = function (booking, cb) {
  this.find({})
      .where('fromDate').lte(booking.arrivalDate)
      .where('toDate').gte(booking.arrivalDate)
      .sort('numberOfNights')
      .exec(function(err, priceBands) {
          if (err) {
              throw err;
          }

          if (!priceBands.length) {
            cb(null);
            return;
          }

          var recursionCheck = 0;
          var nightsRemaining = booking.numberOfNights;
          var totalPrice = 0;
          while (nightsRemaining > 1 && recursionCheck++ < 20) {
            for (var i = priceBands.length - 1; i >= 0; i--) {
              if (priceBands[i].numberOfNights <= nightsRemaining) {
                totalPrice += priceBands[i].price;
                nightsRemaining -= priceBands[i].numberOfNights;
                break;
              }
            }
          }

          // the price bands start at 2 days so if we need
          // 8 days for example (7 days + 1) just add 10%
          // for the additional day
          if (nightsRemaining === 1) {
            totalPrice = Math.ceil(totalPrice * 1.1);
          }
          cb(totalPrice);
      });
};

module.exports = mongoose.model('PriceBand', PriceBandSchema);
