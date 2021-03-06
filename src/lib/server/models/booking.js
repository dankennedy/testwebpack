'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    type: { type: String, required: true, enum: ['deposit', 'balance'] },
    amount: { type: Number, min: 0, required: true },
    receivedDate: { type: Date, required: true, default: Date.now }
});

var exp = mongoose.model('Payment', PaymentSchema);

var BookingSchema = new Schema({
    createdDate: { type: Date, required: true, default: Date.now },
    arrivalDate: { type: Date, required: true },
    reminderSentDate: { type: Date },
    numberOfNights: { type: Number, required: true },
    title: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: Array, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    price: { type: Number, min: 0, required: true },
    deposit: { type: Number, min: 0, required: true },
    notes: { type: String },
    payments: [PaymentSchema],
    voucher: {
        _id: {type: Schema.Types.ObjectId, ref: 'Booking'},
        description: {type: String }
    }
});

var exp;
try {
    exp = mongoose.model('Booking', BookingSchema);
} catch (_) {
    exp = mongoose.model('Booking');
}
module.exports = exp;
