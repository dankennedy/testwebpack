'use strict';

var Validations = function () {};



var Required = function Required(){
  this.validationMessage = "";
};

Required.prototype.validate = function(val) {
  console.log('validating required ' + (val && val.length));
  return val && val.length;
};

Validations.prototype.Required = Required;

module.exports = new Validations();
