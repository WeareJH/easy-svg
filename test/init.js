'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _myModule = require('../lib/index.js');

var _myModule2 = _interopRequireWildcard(_myModule);

var _assert = require('chai');

describe('Using exported functions', function () {
    it('uses the default export', function () {
        _assert.assert.equal(_myModule2['default'](), 'OK - Default');
    });
    it('uses the named function export', function () {
        _assert.assert.equal(_myModule.myOtherFunction(), 'OK - Other');
    });
});