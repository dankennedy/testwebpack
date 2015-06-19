'use strict';

var isArray = typeof Array.isArray === 'function' ? Array.isArray :
    function base$isArray(value) {
        return '[object Array]' === Object.prototype.toString.call(value);
    };

var classNames = function(base, state) {
    var css = base;
    for (var c in state) {
        if (c in state) {
            var s = state[c];
            if (isArray(s) ? s.length > 0 : s) {
                css += ' ' + c;
            }
        }
    }
    return css;
};

module.exports = {
    classNames: classNames
};
