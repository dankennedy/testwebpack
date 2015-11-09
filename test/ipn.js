'use strict';

import assert from 'assert';
var log = require('server/log'),
    ipn = require('server/ipn')({post: function(){}}, log);

suite('IPN', function() {

    test('Promise based https request succeeds', function(done) {
        var request = {
                host: 'www.google.co.uk',
                method: 'GET',
                path: ''
            };

        ipn.requestP(request, '')
            .then(() => assert(true))
            .catch(err => assert(false, err))
            .finally(() => done());
    });


});

