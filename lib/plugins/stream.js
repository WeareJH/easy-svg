'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = easySvgStream;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _index = require('../index');

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var svg4everybody = require.resolve('svg4everybody/svg4everybody.min.js');
var previewPath = _path2.default.resolve(__dirname, '../../templates/preview.html');

var defaults = {
    cwd: process.cwd(),
    svg: {
        path: 'icons.svg'
    },
    preview: {
        path: 'preview.html',
        iconSize: '150px'
    },
    js: {
        path: 'svg4everybody.min.js'
    }
};

function easySvgStream(config) {

    var opts = (0, _objectAssign2.default)({}, defaults, config);

    var builder = (0, _index.create)(opts);

    return _through2.default.obj(function (file, enc, cb) {

        if (file.path.match(/\.svg$/)) {
            var content = file.contents.toString();

            if (content.trim().length) {
                builder.add({ key: file.path, content: file.contents.toString() });
            }
        }

        cb();
    }, function (cb) {

        var stream = this;

        if (!builder.items.length) {
            return end(new Error('No svg files were passed down stream'));
        }

        builder.compile().then(function (out) {

            stream.push(new _vinyl2.default({
                contents: new Buffer(out),
                path: opts.svg.path
            }));

            if (opts.js) {
                var jsfile = _fs2.default.readFileSync(svg4everybody);
                stream.push(new _vinyl2.default({
                    contents: jsfile,
                    path: opts.js.path
                }));
            }

            if (opts.preview) {
                stream.push(new _vinyl2.default({
                    contents: makePreview(builder, opts),
                    path: opts.preview.path
                }));
            }

            cb();
        }).catch(end);

        function end(err) {
            stream.emit('error', err);
            stream.emit('end');
            cb();
        }
    });
};

/**
 * @param builder
 * @param opts
 * @returns {Buffer}
 */
function makePreview(builder, opts) {

    var preview = _fs2.default.readFileSync(previewPath, 'utf-8');
    var js = '';

    if (opts.js) {
        js = makeScript({ path: opts.js.path });
    }

    var svgs = builder.compiled.reduce(function (all, item) {
        all += makeItem({ path: opts.svg.path, id: item.id });
        return all;
    }, '');

    return new Buffer(template(preview, {
        js: js,
        svgs: svgs,
        iconSize: opts.preview.iconSize
    }));
}

/**
 * @param path
 * @param id
 * @returns {*}
 */
function makeItem(_ref) {
    var path = _ref.path,
        id = _ref.id;

    return '<div class="icon-wrapper">\n    <div class="icon-box">\n        <svg><use xlink:href="' + path + '#' + id + '"></use></svg>\n    </div>\n    <div class="icon-snippet">\n        <pre><code>' + id + '</code></pre>\n    </div>\n</div>';
}

/**
 * @param path
 * @returns {*}
 */
function makeScript(_ref2) {
    var path = _ref2.path;

    return '<script src="' + path + '"></script>';
}

/**
 * @param input
 * @param ctx
 * @returns {void|XML|string|*}
 */
function template(input, ctx) {
    return input.replace(/\$\{(.+?)\}/g, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        if (typeof ctx[args[1]] !== 'undefined') {
            return ctx[args[1]];
        }
        return '';
    });
}