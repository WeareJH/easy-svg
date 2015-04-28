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
        path: 'preview.html'
    },
    js: {
        path: 'svg4everybody.min.js'
    }
};

function easySvgStream(config) {

    var builder = _create.create();

    var opts = _assign2['default']({}, defaults, config);

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
    var script = '';

    if (opts.js) {
        script = '<script src="' + opts.js.path + '"></script>';
    }

    preview = preview.replace('%js%', script);

    return new Buffer(preview.replace('%svgs%', builder.compiled.reduce(function (all, item) {

        all += '<div>\n    <svg><use xlink:href="' + opts.svg.path + '#' + item.id + '"></use></svg>\n</div>';
        return all;
    }, '')));
}
module.exports = exports['default'];