'use strict';

var assert = require('assert'),
    validations = require('shared/validations.js');

suite('Validations', function() {

    suite('Required', function() {

        var required;

        setup(function() {
          required = new validations.Required();
        });

        test('should return false for null', function() {
            assert.equal(false, required.validate(null));
        });
        test('should return false for undefined', function() {
            assert.equal(false, required.validate(void 0));
        });
        test('should return false for empty', function() {
            assert.equal(false, required.validate(""));
        });
        test('should return false for no args', function() {
            assert.equal(false, required.validate());
        });
        test('should return true for string', function() {
            assert.equal(true, required.validate("test"));
        });
        test('should return true for date', function() {
            assert.equal(true, required.validate(new Date()));
        });
        test('should return true for number', function() {
            assert.equal(true, required.validate(5));
        });

    });

    suite('WithinRange', function() {

        test('should return true for null with no min/max', function() {
            assert.equal(true, new validations.WithinRange().validate(null));
        });
        test('should return true for null with min/max', function() {
            assert.equal(true, new validations.WithinRange(0, 10).validate(null));
        });
        test('should return true for undefined with no min/max', function() {
            assert.equal(true, new validations.WithinRange().validate(void 0));
        });
        test('should return true for undefined with min/max', function() {
            assert.equal(true, new validations.WithinRange(0, 10).validate(void 0));
        });
        test('should return true for string within min/max', function() {
            assert.equal(true, new validations.WithinRange(0, 10).validate("5"));
        });
        test('should return true for int within min/max', function() {
            assert.equal(true, new validations.WithinRange(0, 10).validate(5));
        });
        test('should return true for float within min/max', function() {
            assert.equal(true, new validations.WithinRange(0, 10).validate(5.123));
        });
        test('should return false for int less than min', function() {
            assert.equal(false, new validations.WithinRange(6, 10).validate(5));
        });
        test('should return false for int more than max', function() {
            assert.equal(false, new validations.WithinRange(6, 10).validate(11));
        });
        test('should return true for int equal to max', function() {
            assert.equal(true, new validations.WithinRange(6, 10).validate(10));
        });
        test('should return true for int equal to min', function() {
            assert.equal(true, new validations.WithinRange(6, 10).validate(6));
        });
        test('should return false for string less than min', function() {
            assert.equal(false, new validations.WithinRange(6, 10).validate("5"));
        });
        test('should return false for string more than max', function() {
            assert.equal(false, new validations.WithinRange(6, 10).validate("11"));
        });

    });

    suite('StringLength', function() {

        test('should return true for null with no max', function() {
            assert.equal(true, new validations.StringLength().validate(null));
        });
        test('should return true for undefined with no max', function() {
            assert.equal(true, new validations.StringLength().validate(void 0));
        });
        test('should return true for empty with no max', function() {
            assert.equal(true, new validations.StringLength().validate(""));
        });
        test('should return true for string length less than max', function() {
            assert.equal(true, new validations.StringLength(5).validate("ABCD"));
        });
        test('should return false for string length more than max', function() {
            assert.equal(false, new validations.StringLength(5).validate("ABCDEFG"));
        });
    });

    suite('EmailAddress', function() {

        var emailaddress,
            valid = ['', void 0, null, 'me@my.com', 'daniel@firstcs.co.uk'],
            invalid = ['me@', 'you.yours.com', 'too.many@consecutive...dots'];

        setup(function() {
          emailaddress = new validations.EmailAddress();
        });

        test('should return true for all valid addresses', function() {
            for (var i = 0; i < valid.length; i++) {
              assert.equal(true, emailaddress.validate(valid[i]),
                "Validation failed for valid address " + valid[i]);
            }
        });

        test('should return false for all invalid addresses', function() {
            for (var i = 0; i < invalid.length; i++) {
              assert.equal(false, emailaddress.validate(invalid[i]),
                "Validation succeeded for invalid address " + invalid[i]);
            }
        });
    });
});
