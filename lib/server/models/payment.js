'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    type: { type: String, required: true, enum: ['deposit', 'balance'] },
    amount: { type: Number, min: 0, required: true },
    receivedDate: { type: Date, required: true, default: Date.now }
});

module.exports = PaymentSchema;
