var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _parseString$Builder = require('./xml2js/xml2js');

var _assign = require('object-assign');

var _assign2 = _interopRequireDefault(_assign);

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

var parseDefaults = {
    stripAttrs: ['id', 'fill']
};
var builderDefaults = {
    headless: true
};

/**
 * Parse an svg
 * @param item
 * @param opts
 * @param cb
 */
function parseSvg(_ref) {
    var item = _ref.item;
    var _ref$opts = _ref.opts;
    var opts = _ref$opts === undefined ? {} : _ref$opts;
    var _ref$cb = _ref.cb;
    var cb = _ref$cb === undefined ? function () {} : _ref$cb;

    var deferred = _Q2['default'].defer();
    _parseString$Builder.parseString(item.content, _assign2['default']({}, parseDefaults, opts), function (err, result) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(transformParsedSvg({ item: item, result: result }));
    });
    return deferred.promise;
}

/**
 * Create an svg from a data obj
 * @param item
 * @param opts
 * @param cb
 */
function buildSvg(_ref2) {
    var item = _ref2.item;
    var _ref2$opts = _ref2.opts;
    var opts = _ref2$opts === undefined ? {} : _ref2$opts;
    var _ref2$cb = _ref2.cb;
    var cb = _ref2$cb === undefined ? function () {} : _ref2$cb;

    var builder = new _parseString$Builder.Builder(_assign2['default']({}, builderDefaults, opts));
    return builder.buildObject(item);
}

/**
 * Add viewbox and id to symbol element
 * @param item
 * @param result
 * @returns {{symbol: {$: {viewBox: viewbox, id: *}}}}
 */
function transformParsedSvg(_ref3) {
    var item = _ref3.item;
    var result = _ref3.result;

    var viewbox = result.svg.$.viewBox;
    delete result.svg.$;
    var other = result.svg;
    var newsvg = {
        symbol: {
            $: {
                viewBox: viewbox,
                id: item.id
            }
        }
    };

    Object.keys(other).forEach(function (key) {
        newsvg.symbol[key] = other[key];
    });

    return newsvg;
}

exports.parse = parseSvg;
exports.build = buildSvg;