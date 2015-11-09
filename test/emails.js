'use strict';

import assert from 'assert';
import emails from 'server/emails';

suite('Emails', function() {

    test('getMessage reads template file and performs replacements', function() {
        let message = emails.getMessage('me@my.com',
            {replkey: 'dan', replkey2: 'the man', title: 'Very important email'},
            'DUMMY CONTENT ##replkey## ##replkey2##');

        assert(message.html.indexOf('DUMMY CONTENT dan the man') != -1);
        assert.equal(message.from, 'Thimble Cottage Whitby <bookings@thimblecottagewhitby.co.uk>');
        assert.equal(message.to, 'me@my.com');
        assert.equal(message.subject, 'Very important email');
        assert.equal(message.bcc, 'bookings@thimblecottagewhitby.co.uk');
    });


});

