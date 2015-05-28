import fs from 'fs';
import path from 'path';
import File from 'vinyl';
import {create} from '../index';
import through2 from 'through2';
import assign from 'object-assign';

const svg4everybody = require.resolve('svg4everybody/svg4everybody.min.js');
const previewPath   = path.resolve(__dirname, '../../templates/preview.html');

const defaults = {
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

export default function easySvgStream(config) {

    const opts  = assign({}, defaults, config);

    let builder = create(opts);

    return through2.obj(function (file, enc, cb) {

        if (file.path.match(/\.svg$/)) {
            builder.add({key: file.path, content: file.contents.toString()});
        }

        cb();

    }, function (cb) {

        var stream = this;

        if (!builder.items.length) {
            return end(new Error('No svg files were passed down stream'));
        }

        builder.compile()

            .then((out) => {

                stream.push(new File({
                    contents: new Buffer(out),
                    path: opts.svg.path
                }));

                if (opts.js) {
                    var jsfile = fs.readFileSync(svg4everybody);
                    stream.push(new File({
                        contents: jsfile,
                        path: opts.js.path
                    }));
                }

                if (opts.preview) {
                    stream.push(new File({
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
function makePreview (builder, opts) {

    let preview = fs.readFileSync(previewPath, 'utf-8');
    let js = '';

    if (opts.js) {
        js = makeScript({path: opts.js.path});
    }

    let svgs = builder.compiled.reduce(function (all, item) {
        all += makeItem({path: opts.svg.path, id: item.id});
        return all;
    }, '');

    return new Buffer(template(preview, {
        js,
        svgs,
        iconSize: opts.preview.iconSize
    }));
}

/**
 * @param path
 * @param id
 * @returns {*}
 */
function makeItem ({path, id}) {
    return `<div class="icon-wrapper">
    <div class="icon-box">
        <svg><use xlink:href="${path}#${id}"></use></svg>
    </div>
    <div class="icon-snippet">
        <pre><code>${id}</code></pre>
    </div>
</div>`;
}

/**
 * @param path
 * @returns {*}
 */
function makeScript ({path}) {
    return `<script src="${path}"></script>`;
}

/**
 * @param input
 * @param ctx
 * @returns {void|XML|string|*}
 */
function template (input, ctx) {
    return input.replace(/\$\{(.+?)\}/g, function (...args) {
        if (typeof ctx[args[1]] !== 'undefined') {
            return ctx[args[1]];
        }
        return '';
    });
}
