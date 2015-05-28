var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = easySvgStream;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _File = require('vinyl');

var _File2 = _interopRequireDefault(_File);

var _create = require('../index');

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _assign = require('object-assign');

var _assign2 = _interopRequireDefault(_assign);

var svg4everybody = require.resolve('svg4everybody/svg4everybody.min.js');
var previewPath = _path2['default'].resolve(__dirname, '../../templates/preview.html');

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

    var opts = _assign2['default']({}, defaults, config);

    var builder = _create.create(opts);

    return _through22['default'].obj(function (file, enc, cb) {

        if (file.path.match(/\.svg$/)) {
            builder.add({ key: file.path, content: file.contents.toString() });
        }

        cb();
    }, function (cb) {

        var stream = this;

        if (!builder.items.length) {
            return end(new Error('No svg files were passed down stream'));
        }

        builder.compile().then(function (out) {

            stream.push(new _File2['default']({
                contents: new Buffer(out),
                path: opts.svg.path
            }));

            if (opts.js) {
                var jsfile = _fs2['default'].readFileSync(svg4everybody);
                stream.push(new _File2['default']({
                    contents: jsfile,
                    path: opts.js.path
                }));
            }

            if (opts.preview) {
                stream.push(new _File2['default']({
                    contents: makePreview(builder, opts),
                    path: opts.preview.path
                }));
            }

            cb();
        })['catch'](end);

        function end(err) {
            stream.emit('error', err);
            stream.emit('end');
            cb();
        }
    });
}

;

/**
 * @param builder
 * @param opts
 * @returns {Buffer}
 */
function makePreview(builder, opts) {

    var preview = _fs2['default'].readFileSync(previewPath, 'utf-8');
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
    var path = _ref.path;
    var id = _ref.id;

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
        if (typeof ctx[arguments[1]] !== 'undefined') {
            return ctx[arguments[1]];
        }
        return '';
    });
}
module.exports = exports['default'];