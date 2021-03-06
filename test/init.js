const {create, stream} = require('../dist');
const vfs = require('vinyl-fs');
const {parse, build} = require('../dist/parser.js');
const {assert} = require('chai');
const through2 = require('through2');

const input1 = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g id="BOOK_2_1_" enable-background="new    ">
	<g id="BOOK_2">
		<g>
			<path d="M10.759,32.73L10.759,32.73l11,5l0,0C22.137,37.902,22.557,38,23,38c1.657,0,3-1.343,3-3
				c0-1.214-0.721-2.259-1.759-2.731l0,0l-11-5l0,0C12.863,27.097,12.443,27,12,27c-1.657,0-3,1.343-3,3
				C9,31.214,9.721,32.259,10.759,32.73z M10.759,43.73L10.759,43.73l11,5l0,0C22.137,48.902,22.557,49,23,49c1.657,0,3-1.343,3-3
				c0-1.214-0.721-2.259-1.759-2.73l0,0l-11-5l0,0C12.863,38.098,12.443,38,12,38c-1.657,0-3,1.343-3,3
				C9,42.214,9.721,43.259,10.759,43.73z M10.759,21.731L10.759,
				21.731l11,5l0,0C22.137,26.903,22.557,27,23,27c1.657,0,3-1.343,3-3
				c0-1.214-0.721-2.259-1.759-2.731l0,0l-11-5l0,0C12.863,16.097,12.443,16,12,16c-1.657,0-3,1.343-3,3
				C9,20.214,9.721,21.259,10.759,21.731z M41,49c0.443,0,0.863-0.098,1.241-0.27l0,0l11-5l0,0C54.279,43.259,55,42.214,55,41
				c0-1.657-1.343-3-3-3c-0.443,0-0.863,0.098-1.241,0.27l0,0l-11,5l0,0C38.721,43.741,38,44.786,38,46C38,47.657,39.343,49,41,49z
				 M61,0c-0.406,0-0.794,0.082-1.146,0.228l0,0L59.848,0.23c-0.009,0.004-0.018,0.007-0.027,0.011L32,11.753L4.179,0.241
				C4.17,0.237,4.161,0.234,4.152,0.23L4.147,0.228l0,0C3.794,0.082,3.406,0,3,0C1.343,0,0,1.343,0,3v46
				c0,1.257,0.774,2.333,1.871,2.779l28.942,11.977C31.177,63.913,31.578,64,32,64s0.823-0.087,1.188-0.245l28.941-11.976
				C63.227,51.333,64,50.257,64,49V3C64,1.343,62.657,0,61,0z M29,56.512L6,46.995V7.488l23,9.517V56.512z M58,46.995l-23,9.517
				V17.005l23-9.517V46.995z M41,38c0.443,0,0.863-0.098,1.241-0.27l0,0l11-5C54.279,32.259,55,31.214,55,30c0-1.657-1.343-3-3-3
				c-0.443,0-0.863,0.097-1.241,0.269l0,0l-11,5l0,0C38.721,32.741,38,33.786,38,35C38,36.657,39.343,38,41,38z M41,27
				c0.443,0,0.863-0.097,1.241-0.269l0,0l11-5l0,0C54.279,21.259,55,20.214,55,19c0-1.657-1.343-3-3-3
				c-0.443,0-0.863,0.097-1.241,0.269l0,0l-11,5C38.721,21.741,38,22.786,38,24C38,25.657,39.343,27,41,27z"/>
		</g>
	</g>
</g>
</svg>
`;

const input2 = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="72px" height="64px" viewBox="0 0 72 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.2.2 (9983) - http://www.bohemiancoding.com/sketch -->
    <title>square-add</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="square-add" sketch:type="MSLayerGroup" fill="#000000">
            <g id="SQUARE__x2F__ADD_1_" sketch:type="MSShapeGroup">
                <g id="SQUARE__x2F__ADD">
                    <path d="M23,35 L33,35 L33,45 C33,46.657 34.343,48 36,48 C37.657,48 39,46.657 39,45 L39,35 L49,35 C50.657,35 52,33.657 52,32 C52,30.343 50.657,29 49,29 L39,29 L39,19 C39,17.343 37.657,16 36,16 C34.343,16 33,17.343 33,19 L33,29 L23,29 C21.343,29 20,30.343 20,32 C20,33.657 21.343,35 23,35 L23,35 Z M65,0 L7,0 C5.343,0 4,1.343 4,3 L4,61 C4,62.657 5.343,64 7,64 L65,64 C66.657,64 68,62.657 68,61 L68,3 C68,1.343 66.657,0 65,0 L65,0 Z M62,64 L10,64 L10,6 L62,6 L62,64 L62,64 Z" id="Shape"></path>
                    <rect id="Rectangle-1" x="0" y="59" width="10" height="5"></rect>
                    <rect id="Rectangle-2" x="62" y="59" width="10" height="5"></rect>
                </g>
            </g>
        </g>
    </g>
</svg>
`;

const input3 = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="72px" height="64px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.2.2 (9983) - http://www.bohemiancoding.com/sketch -->
    <title>square-add</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="square-add" sketch:type="MSLayerGroup" fill="#000000">
            <g id="SQUARE__x2F__ADD_1_" sketch:type="MSShapeGroup">
                <g id="SQUARE__x2F__ADD">
                    <path d="M23,35 L33,35 L33,45 C33,46.657 34.343,48 36,48 C37.657,48 39,46.657 39,45 L39,35 L49,35 C50.657,35 52,33.657 52,32 C52,30.343 50.657,29 49,29 L39,29 L39,19 C39,17.343 37.657,16 36,16 C34.343,16 33,17.343 33,19 L33,29 L23,29 C21.343,29 20,30.343 20,32 C20,33.657 21.343,35 23,35 L23,35 Z M65,0 L7,0 C5.343,0 4,1.343 4,3 L4,61 C4,62.657 5.343,64 7,64 L65,64 C66.657,64 68,62.657 68,61 L68,3 C68,1.343 66.657,0 65,0 L65,0 Z M62,64 L10,64 L10,6 L62,6 L62,64 L62,64 Z" id="Shape"></path>
                    <rect id="Rectangle-1" x="0" y="59" width="10" height="5"></rect>
                    <rect id="Rectangle-2" x="62" y="59" width="10" height="5"></rect>
                </g>
            </g>
        </g>
    </g>
</svg>`;

const input4 = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 194 40" enable-background="new 0 0 194 40" xml:space="preserve">
<g id="Layer_1" display="none">
	<rect x="0.7" display="inline" fill="#1B2032" width="194" height="40"/>
</g>
<g id="Layer_2">
	<g>
		<path fill="#FFFFFF" d="M15,6.6c4.3,0,6.6,1.7,6.6,5.7c0,2.9-1.1,4.3-2.9,5.1c2,0.7,3.5,2,3.5,5.2c0,4.7-2.7,6.2-6.9,6.2H6.9V6.6
			H15z M9.4,8.8v7.7h5.7c2.8,0,4-1.3,4-4c0-2.6-1.4-3.7-4.2-3.7H9.4z M9.4,18.6v8h5.9c2.7,0,4.5-0.9,4.5-4.2c0-3.4-2.9-3.9-4.6-3.9
			H9.4z"/>
		<path fill="#FFFFFF" d="M26.9,12.8h2.4v2.2c0,0,2.8-1.9,5.9-2.5v2.4c-3,0.6-5.9,2.2-5.9,2.2v11.8h-2.4V12.8z"/>
		<path fill="#FFFFFF" d="M51.5,20.6c0,5.9-1.4,8.6-6.9,8.6c-5.4,0-6.9-2.7-6.9-8.6c0-5.5,1.8-8.2,6.9-8.2
			C49.7,12.4,51.5,15.1,51.5,20.6z M49,20.6c0-4.5-1-6.1-4.4-6.1c-3.4,0-4.4,1.6-4.4,6.1c0,4.6,0.6,6.5,4.4,6.5
			C48.4,27.1,49,25.2,49,20.6z"/>
		<path fill="#FFFFFF" d="M57,12.8l3.3,14h0.5l3.8-13.7h2.5l3.8,13.7h0.5l3.2-14h2.4l-3.8,16.1h-4l-3.4-12.6l-3.4,12.6h-4l-3.8-16.1
			H57z"/>
		<path fill="#FFFFFF" d="M91.6,15.1c0,0-3.6-0.5-5.6-0.5c-2,0-3.5,0.5-3.5,2.4c0,1.5,0.8,1.9,4.2,2.5c4,0.7,5.5,1.5,5.5,4.6
			c0,3.8-2.4,5-6.2,5c-2.1,0-5.7-0.6-5.7-0.6l0.1-2.1c0,0,3.7,0.5,5.3,0.5c2.6,0,4.1-0.6,4.1-2.8c0-1.7-0.8-2.1-4.3-2.6
			c-3.6-0.6-5.4-1.3-5.4-4.5c0-3.5,2.9-4.7,5.8-4.7c2.4,0,5.8,0.6,5.8,0.6L91.6,15.1z"/>
		<path fill="#FFFFFF" d="M108.4,26.8l0.1,1.9c0,0-3.7,0.5-6.3,0.5c-4.8,0-6.4-2.8-6.4-8.3c0-6.1,2.6-8.5,6.7-8.5
			c4.3,0,6.5,2.3,6.5,7.5l-0.1,1.8H98.3c0,3.4,1.1,5.2,4.2,5.2C104.9,27,108.4,26.8,108.4,26.8z M106.6,19.9c0-4-1.2-5.4-4.1-5.4
			c-2.7,0-4.3,1.5-4.3,5.4H106.6z"/>
		<path fill="#FFFFFF" d="M113.5,12.8h2.4v2.2c0,0,2.8-1.9,5.9-2.5v2.4c-3,0.6-5.9,2.2-5.9,2.2v11.8h-2.4V12.8z"/>
		<path fill="#FFFFFF" d="M138.2,9c0,0-4.5-0.5-6.3-0.5c-3.2,0-4.8,1.1-4.8,3.6c0,2.9,1.5,3.4,5.4,4.2c4.4,1,6.4,2.1,6.4,6
			c0,4.9-2.7,6.9-7.1,6.9c-2.6,0-7.1-0.7-7.1-0.7l0.3-2.1c0,0,4.4,0.6,6.7,0.6c3.2,0,4.8-1.4,4.8-4.5c0-2.5-1.3-3.2-5-3.9
			c-4.6-1-6.9-2.1-6.9-6.3c0-4.3,2.8-6,7.2-6c2.6,0,6.7,0.6,6.7,0.6L138.2,9z"/>
		<path fill="#FFFFFF" d="M143.9,12.8l4,14h1.1l4.1-14h2.4L148.8,36h-2.4l2.1-7.1h-2.4l-4.6-16.1H143.9z"/>
		<path fill="#FFFFFF" d="M159.2,28.9V12.8h2.4v1.1c0,0,2.6-1.4,5-1.4c4.4,0,5.4,2.2,5.4,7.9v8.5h-2.4v-8.4c0-4.2-0.5-5.8-3.5-5.8
			c-2.3,0-4.5,1.2-4.5,1.2v13.1H159.2z"/>
		<path fill="#FFFFFF" d="M187.6,12.9l-0.1,2c0,0-2.6-0.3-3.8-0.3c-3.7,0-4.7,1.6-4.7,5.9c0,4.8,0.7,6.5,4.7,6.5
			c1.2,0,3.8-0.3,3.8-0.3l0.1,2c0,0-3,0.5-4.5,0.5c-5.1,0-6.6-2.4-6.6-8.7c0-5.8,1.9-8.1,6.7-8.1C184.7,12.4,187.6,12.9,187.6,12.9z
			"/>
	</g>
</g>
</svg>
`;

describe('Using exported functions', () => {
    it('creates a builder', () => {
        let builder = create();
        assert.equal(builder.opts.id, 'svg-%f');
    });
    it('Adds files', () => {
        let builder = create();
        builder.add({key: 'wergtert/book.svg', content: input1});
        assert.equal(builder.items.length, 1);
        assert.equal(builder.items[0].id, 'svg-book');
    });
    it('Adds files with custom id', () => {
        let builder = create({id: 'icon-svg-%f'});
        builder.add({key: 'wergtert/book.svg', content: input1});
        assert.equal(builder.items.length, 1);
        assert.equal(builder.items[0].id, 'icon-svg-book');
    });
    it('Adds multiple files', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input1});
        builder.add({key: '/wergw/wreggwergtert/book.svg', content: input2});
        assert.equal(builder.items.length, 2);
        assert.equal(builder.items[0].id, 'svg-newtab');
        assert.equal(builder.items[1].id, 'svg-book');
    });
    it('Parses xml', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input1});
        return parse({
            item: builder.items[0]
        }).then((result) => {
            assert.ok(result.transformed.symbol);
            assert.equal(result.transformed.symbol.$.id, 'svg-newtab');
            assert.equal(result.transformed.symbol.$.viewBox, '0 0 64 64');
        });
    });
    it('Strips FILL', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input3});
        return builder.compile().then(function (out) {
            assert.notInclude(out, 'fill="#000"');
        });
    });
    it('builds from parsed', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input1});
        return parse({
            item: builder.items[0]
        }).then((item) => {
            let built = build({item: item.transformed});
            let line = built.split('\n')[0];
            assert.equal(line, '<symbol id="svg-newtab" viewBox="0 0 64 64">');
        });
    });
    it('Compiles many into a single sheet', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input1});
        builder.add({key: 'wergtert/sync.svg', content: input2});
        return builder.compile().then(function (out) {
            assert.include(out, '<symbol id="svg-newtab"');
            assert.include(out, '<symbol id="svg-sync"');
        });
    });
    it('Adds missing viewbox', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input3});
        return builder.compile().then(function (out) {
            assert.include(out, 'viewBox="0 0 72 64"');
        });
    });
    it('Adds missing viewbox 2', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input4});
        return builder.compile().then(function (out) {
            assert.include(out, 'viewBox="0 0 194 40"');
        });
    });
    it('Can accessed compiled items', () => {
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input4});
        return builder.compile().then(function () {
            assert.equal(builder.compiled[0].id, 'svg-newtab');
        });
    });
    it('keeps fill=none attr', () => {
        const input5 = `<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In  -->
<svg version="1.1"
	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
	 x="0px" y="0px" width="191.4px" height="191.4px" viewBox="0 0 191.4 191.4" enable-background="new 0 0 191.4 191.4"
	 xml:space="preserve">
<defs>
</defs>
<circle id="XMLID_20_" fill="none" stroke="#FFFFFF" stroke-width="22" stroke-miterlimit="10" cx="95.7" cy="95.7" r="84.7"/>
<path id="XMLID_19_" fill="#FFFFFF" d="M87.8,57l46.7,32.6c4.2,3,4.2,9.2,0,12.2l-45.3,31.6c-4.7,3.3-11.1-0.1-11.1-5.8V95.7V62C78.1,57.1,83.7,54.1,87.8,57z"/>
</svg>
`;
        let builder = create();
        builder.add({key: 'wergtert/newtab.svg', content: input5});
        return builder.compile().then(function (out) {
            assert.include(out, 'fill="none"');
        });
    });
    it('Can sends the correct files down with no configuration', (done) => {
        let paths = [];
        vfs.src("fixtures/*.svg")
            .pipe(stream())
            .pipe(through2.obj(function (file, enc, cb) {
                paths.push(file.path);
                cb();
            }, function () {
                assert.equal(paths.length, 3);
                assert.include(paths, 'icons.svg');
                assert.include(paths, 'preview.html');
                assert.include(paths, 'svg4everybody.min.js');
                done();
            }));
    });
    it('can accept the config object when used via a stream', (done) => {
        let files = [];
        vfs.src("fixtures/bin.svg")
            .pipe(stream({
                id: "shane-%f"
            }))
            .pipe(through2.obj(function (file, enc, cb) {
                files.push(file._contents.toString());
                cb();
            }, function () {
                assert.include(files[0], 'id="shane-bin"');
                done();
            }));
    });
    it('Can omit the preview', (done) => {
        let paths = [];
        vfs.src("fixtures/*.svg")
            .pipe(stream({
                preview: false
            }))
            .pipe(through2.obj(function (file, enc, cb) {
                paths.push(file.path);
                cb();
            }, function () {
                assert.equal(paths.length, 2);
                assert.include(paths, 'icons.svg');
                assert.include(paths, 'svg4everybody.min.js');
                done();
            }));
    });
    it('Can omit the JS', (done) => {
        let paths = [];
        vfs.src("fixtures/*.svg")
            .pipe(stream({
                js: false,
                preview: false
            }))
            .pipe(through2.obj(function (file, enc, cb) {
                paths.push(file.path);
                cb();
            }, function () {
                assert.equal(paths.length, 1);
                assert.include(paths, 'icons.svg');
                done();
            }));
    });
    it('Can propagate errors from svgo parsing', (done) => {
        vfs.src("fixtures/invalid/unclosed-tags.svg")
            .pipe(stream())
            .on('error', function (err) {
                assert.include(err.message, 'unclosed-tags.svg:');
                done();
            });
    });
    it('Can handle files that cannot be parsed (jibberish)', (done) => {
        vfs.src("fixtures/invalid/random.svg")
            .pipe(stream())
            .on('error', function (err) {
                assert.include(err.message, 'random.svg: SVGO');
                done();
            });
    });
    it('Can throw when no files processed (maybe empty)', (done) => {
        vfs.src("fixtures/invalid/empty.svg")
            .pipe(stream())
            .on('error', function (err) {
                assert.include(err.message, 'No svg files were passed down stream');
                done();
            });
    });
});
