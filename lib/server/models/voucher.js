'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VoucherSchema = new Schema({
    createdDate: { type: Date, required: true, default: Date.now },
    usedDate: { type: Date },
    discountType: { type: String, required: true, enum: ['fixedprice', 'percentdiscount'] },
    description: { type: String, required: true },
    totalPrice: { type: Number },
    percentDiscount: { type: Number },
    booking: {type: Schema.Types.ObjectId, ref: 'Booking'}
});

var exp;
try {
    exp = mongoose.model('Voucher', VoucherSchema);
} catch (_) {
    exp = mongoose.model('Voucher');
}
module.exports = exp;
