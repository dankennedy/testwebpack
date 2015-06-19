'use strict';

var utils = require('shared/utils');

var Validations = function () {};



var Required = function(){
  this.validationMessage = "";
};
Required.prototype.validate = function(val) {
  return val && val.toString().length ? true : false;
};
Validations.prototype.Required = Required;

var WithinRange = function(min, max){
  this.validationMessage = "";
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

var StringLength = function(max){
  this.validationMessage = "";
  this.max = max;
};
StringLength.prototype.validate = function(val) {
  return !val || val.toString().length <= this.max;
};
Validations.prototype.StringLength = StringLength;

var EmailAddress = function(){
  this.validationMessage = "";
};
EmailAddress.prototype.validate = function(val) {
  return !val || /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(val);
};
Validations.prototype.EmailAddress = EmailAddress;



module.exports = new Validations();
