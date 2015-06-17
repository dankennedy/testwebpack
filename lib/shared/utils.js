'use strict';

var Utils = function () {};

Utils.prototype.outputSomeStuff = function (blah) {
  console.log(blah);
};

module.exports = new Utils();
