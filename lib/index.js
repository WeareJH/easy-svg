var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.myOtherFunction = myOtherFunction;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _assign = require('object-assign');

var _assign2 = _interopRequireDefault(_assign);

var _stream = require('./plugins/stream');

var _stream2 = _interopRequireDefault(_stream);

var _parse$build = require('./parser.js');

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

var defaults = {
    id: 'svg-%f'
};

var Symbols = (function () {

    /**
     * @param opts
     */

    function Symbols(opts) {
        _classCallCheck(this, Symbols);

        this.opts = _assign2['default']({}, defaults, opts);
        this.items = [];
    }

    _createClass(Symbols, [{
        key: 'add',

        /**
         * @param {string} key
         * @param {string} content
         */
        value: function add(_ref) {
            var key = _ref.key;
            var content = _ref.content;

            _assert2['default'](typeof key === 'string', 'Key should be a string, like a filename');
            _assert2['default'](typeof content === 'string', 'Content should be a string');

            this.items.push({
                key: key,
                content: content,
                id: this.makeId({ key: key })
            });
        }
    }, {
        key: 'makeId',

        /**
         * @param key
         * @returns {XML|string|void|*}
         */
        value: function makeId(_ref2) {
            var key = _ref2.key;

            return this.opts.id.replace('%f', _path2['default'].basename(key, '.svg'));
        }
    }, {
        key: 'compile',

        /**
         * Compile all items
         */
        value: function compile() {
            var _this = this;

            var proms = [];

            this.items.forEach(function (item) {
                var parsed = _parse$build.parse({ item: item });
                proms.push(parsed);
            });

            return _Q2['default'].all(proms).then(function (out) {
                return _this.saveTransformed(out);
            }).then(this.wrapMany);
        }
    }, {
        key: 'wrapMany',

        /**
         * @param items
         * @returns {*}
         */
        value: function wrapMany(items) {
            var wrapper = function wrapper(all, item) {
                all += _parse$build.build({ item: item.transformed }) + '\n';
                return all;
            };
            return Symbols.wrap(items.reduce(wrapper, ''));
        }
    }, {
        key: 'saveTransformed',

        /**
         * Save the transformed data
         * @param out
         * @returns {*}
         */
        value: function saveTransformed(out) {
            this.compiled = out.map(function (item) {
                return item.transformed.symbol.$;
            });
            return out;
        }
    }], [{
        key: 'wrap',
        value: function wrap(items) {
            return '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none">\n    ' + items + '\n</svg>';
        }
    }]);

    return Symbols;
})();

function createSymbolBuilder(opts) {
    return new Symbols(opts);
}

exports['default'] = createSymbolBuilder;
exports.create = createSymbolBuilder;
exports.stream = _stream2['default'];

function myOtherFunction() {
    return 'OK - Other';
}