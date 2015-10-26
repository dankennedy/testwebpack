'use strict';

var mongoose = require('mongoose'),
    PaymentSchema = require('./payment'),
    Schema = mongoose.Schema;

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

module.exports = mongoose.model('Booking', BookingSchema);
