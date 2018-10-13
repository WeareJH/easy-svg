'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.process = exports.build = exports.parse = undefined;

var _xml2js = require('xml2js');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _svgo = require('svgo');

var _svgo2 = _interopRequireDefault(_svgo);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var svgoDefaults = {
    plugins: [{ removeFill: false }]
};

var svgo = new _svgo2.default(svgoDefaults);

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
    var item = _ref.item,
        _ref$opts = _ref.opts,
        opts = _ref$opts === undefined ? {} : _ref$opts;


    var deferred = _q2.default.defer();

    try {
        svgo.optimize(item.content, function (result) {
            if (result.error) {
                deferred.reject(createError(item, 'SVGO: ' + result.error));
                return;
            }
            (0, _xml2js.parseString)(result.data, (0, _objectAssign2.default)({}, parseDefaults, opts), function (err, result) {
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
    var base = (0, _path.basename)(item.key);
    var e = new Error(base + ': ' + message);
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
    var item = _ref2.item,
        _ref2$opts = _ref2.opts,
        opts = _ref2$opts === undefined ? {} : _ref2$opts,
        _ref2$cb = _ref2.cb,
        cb = _ref2$cb === undefined ? function () {} : _ref2$cb;

    var builder = new _xml2js.Builder((0, _objectAssign2.default)({}, builderDefaults, opts));
    return builder.buildObject(item);
}

/**
 * Add viewbox and id to symbol element
 * @param item
 * @param result
 * @returns {{symbol: {$: {viewBox: viewBox, id: *}}}}
 */
function transformParsedSvg(_ref3) {
    var item = _ref3.item,
        result = _ref3.result;
    var _result$svg$$ = result.svg.$,
        height = _result$svg$$.height,
        width = _result$svg$$.width,
        viewBox = _result$svg$$.viewBox;


    delete result.svg.$;

    var other = result.svg;

    var newsvg = {
        'symbol': {
            '$': {
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