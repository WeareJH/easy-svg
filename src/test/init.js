import myModule from '../lib/index.js';
import {myOtherFunction} from '../lib/index.js';
import {assert} from 'chai';

describe('Using exported functions', () => {
    it('uses the default export', () => {
        assert.equal(myModule(), "OK - Default");
    });
    it('uses the named function export', () => {
        assert.equal(myOtherFunction(), "OK - Other");
    });
});