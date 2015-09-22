'use strict';

var utils = require('./utils'),
    moment = require('moment');

var Validations = function () {};


//----------------------------
var Required = function(msg){
  this.validationMessage = msg || 'This field is required';
};
Required.prototype.validate = function(val) {
  return val && val.toString().length ? true : false;
};
Validations.prototype.Required = Required;


//----------------------------
var IsNumber = function(msg){
  this.validationMessage = msg || 'This field must contain a number';
};
IsNumber.prototype.validate = function(val) {
  return val !== null && val !== '' && utils.isNumeric(val);
};
Validations.prototype.IsNumber = IsNumber;


//----------------------------
var WithinRange = function(min, max, msg){
  this.validationMessage = msg || (
    !min ? 'Choose a value less than ' + max : (!max ? 'Choose a value greater than ' + min : 'Choose a value between ' + min + ' and ' + max)
    );
  this.min = min;
  this.max = max;
};
WithinRange.prototype.validate = function(val) {
  if (!val || !utils.isNumeric(val)) {
    return true;
  }
  return ((!this.min || val >= this.min) && (!this.max || val <= this.max));
};
Validations.prototype.WithinRange = WithinRange;


//----------------------------
var StringLength = function(min, max, msg){
  this.validationMessage = msg || (
    !min ? 'Maximum length of this field is ' + max : (!max ? 'Minimum length of this field is ' + min : 'Length of this field must be between ' + min + ' and ' + max)
    );
  this.min = min;
  this.max = max;
};
StringLength.prototype.validate = function(val) {
  return !val || ((!this.min || val.toString().length >= this.min) && (!this.max || val.toString().length <= this.max));
};
Validations.prototype.StringLength = StringLength;


//----------------------------
var EmailAddress = function(msg){
  this.validationMessage = msg || 'Invalid email address';
};
EmailAddress.prototype.validate = function(val) {
  return !val || /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(val);
};
Validations.prototype.EmailAddress = EmailAddress;


//----------------------------
var IsDate = function(fmt, msg){
  this.validationMessage = msg || 'Please provide a date in the format ' + fmt;
  this.fmt = fmt;
};
IsDate.prototype.validate = function(val) {
  return moment(val, this.fmt, true).isValid();
};
Validations.prototype.IsDate = IsDate;


module.exports = new Validations();
