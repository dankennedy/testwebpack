'use strict';

import _ from 'lodash';

var classNames = function(base, state) {
    var css = base;
    for (var c in state) {
        if (c in state) {
            var s = state[c];
            if (_.isArray(s) ? s.length > 0 : s) {
                css += ' ' + c;
            }
        }
    }
    return css;
};

var isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

module.exports = {
    classNames: classNames,
    isNumeric: isNumeric,
    isArray: _.isArray
};
