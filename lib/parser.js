var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _parseString$Builder = require('xml2js');

var _assign = require('object-assign');

var _assign2 = _interopRequireDefault(_assign);

var _Q = require('q');

var _Q2 = _interopRequireDefault(_Q);

var _SVGO = require('svgo');

var _SVGO2 = _interopRequireDefault(_SVGO);

var _basename = require('path');

var svgoDefaults = {
    plugins: [{ removeFill: false }]
};

var svgo = new _SVGO2['default'](svgoDefaults);

svgo.config.plugins[2].push({
    type: 'perItem',
    active: true,
    name: 'removeAttrs',
    params: {
        attrs: ['fill']
    },
    fn: function fn(item, params) {
        item.eachAttr(function (attr) {
            if (params.attrs.indexOf(attr.name) > -1) {
                if (attr.value !== 'none') {
                    item.removeAttr(attr.name);
                }
            }
        });
    }
});

var parseDefaults = {
    trim: true,
    valueProcessors: [function (item) {
        return item.trim();
    }]
};

var builderDefaults = {
    headless: true
};

/**
 * @param item
 * @param opts
 * @returns {*|promise}
 */
function parseSvg(_ref) {
    var item = _ref.item;
    var _ref$opts = _ref.opts;
    var opts = _ref$opts === undefined ? {} : _ref$opts;

    var deferred = _Q2['default'].defer();

    try {
        svgo.optimize(item.content, function (result) {
            if (result.error) {
                deferred.reject(createError(item, 'SVGO: ' + result.error));
                return;
            }
            _parseString$Builder.parseString(result.data, _assign2['default']({}, parseDefaults, opts), function (err, result) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve({
                    result: result,
                    transformed: transformParsedSvg({ item: item, result: result })
                });
            });
        });
    } catch (e) {
        deferred.reject(createError(item, e.message));
    }

    return deferred.promise;
}

function createError(item, message) {
    var base = _basename.basename(item.key);
    var e = new Error('' + base + ': ' + message);
    var stack = e.stack.split('\n');
    e.stack = [stack[0], ' File: ' + base, ' Path: ' + item.key, ' Msg:  ' + message, ''].join('\n');
    return e;
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
 * @returns {{symbol: {$: {viewBox: viewBox, id: *}}}}
 */
function transformParsedSvg(_ref3) {
    var item = _ref3.item;
    var result = _ref3.result;
    var _result$svg$$ = result.svg.$;
    var height = _result$svg$$.height;
    var width = _result$svg$$.width;
    var viewBox = _result$svg$$.viewBox;

    delete result.svg.$;

    var other = result.svg;

    var newsvg = {
        symbol: {
            $: {
                id: item.id
            }
        }
    };

    if (viewBox) {
        newsvg.symbol.$.viewBox = viewBox;
    } else {
        newsvg.symbol.$.viewBox = '0 0 ' + width + ' ' + height;
    }

    Object.keys(other).forEach(function (key) {
        return newsvg.symbol[key] = other[key];
    });

    return newsvg;
}

exports.parse = parseSvg;
exports.build = buildSvg;
exports.process = transformParsedSvg;