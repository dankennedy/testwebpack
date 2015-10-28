'use strict';

import assert from 'assert';
import { DateUtils } from 'shared/dates.js';

suite('Date Utils', function() {

    suite('getPriceBandMonthName', function() {

        test('should return month name for month outside `special` months', function() {
            assert.equal('January', DateUtils.getPriceBandMonthName(new Date(2015,0,1)));
        });

        test('should return christmas for December', function() {
            assert.equal('Christmas/New Year', DateUtils.getPriceBandMonthName(new Date(2015,11,2)));
        });

        test('should split early July', function() {
            assert.equal('July (1-15)', DateUtils.getPriceBandMonthName(new Date(2015,6,2)));
        });

        test('should split late July', function() {
            assert.equal('July (16-31)', DateUtils.getPriceBandMonthName(new Date(2015,6,25)));
        });

    });

});
