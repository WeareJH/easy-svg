import fs from 'fs';
import File from 'vinyl';
import {create} from '../index';
import through2 from 'through2';
import assign from 'object-assign';

const svg4everybody = require.resolve('svg4everybody/svg4everybody.min.js');
const previewPath = './templates/preview.html';

const defaults = {
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

export default function easySvgStream(config) {

    let builder = create();

    const opts  = assign({}, defaults, config);

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
    let script = '';

    if (opts.js) {
        script = `<script src="${opts.js.path}"></script>`;
    }

    preview = preview.replace('%js%', script);

    return new Buffer(preview.replace('%svgs%', builder.compiled.reduce(function (all, item) {

        all += `<div>
    <svg><use xlink:href="${opts.svg.path}#${item.id}"></use></svg>
</div>`;
        return all;

    }, '')));
}
