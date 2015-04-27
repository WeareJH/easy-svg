var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _create$add = require('../lib/index.js');

var _parse$build = require('../lib/parser.js');

var _writeFileSync$readFileSync = require('fs');

var _assign = require('object-assign');

var _assign2 = _interopRequireDefault(_assign);

var _assert = require('chai');

var input1 = '\n<?xml version="1.0" encoding="utf-8"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">\n<g id="BOOK_2_1_" enable-background="new">\n\t<g id="BOOK_2">\n\t\t<g>\n\t\t\t<path d="0.269l0,0l-11,5C38.721,21.741,38,22.786,38,24C38,25.657,39.343,27,41,27z"/>\n\t\t</g>\n\t</g>\n</g>\n</svg>';

var input2 = '\n<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="72px" height="64px" viewBox="0 0 72 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n    <!-- Generator: Sketch 3.2.2 (9983) - http://www.bohemiancoding.com/sketch -->\n    <title>square-add</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="square-add" sketch:type="MSLayerGroup" fill="#000000">\n            <g id="SQUARE__x2F__ADD_1_" sketch:type="MSShapeGroup">\n                <g id="SQUARE__x2F__ADD">\n                    <path d="M23,35 L33,35 L33,45 C33,46.657 34.343,48 36,48 C37.657,48 39,46.657 39,45 L39,35 L49,35 C50.657,35 52,33.657 52,32 C52,30.343 50.657,29 49,29 L39,29 L39,19 C39,17.343 37.657,16 36,16 C34.343,16 33,17.343 33,19 L33,29 L23,29 C21.343,29 20,30.343 20,32 C20,33.657 21.343,35 23,35 L23,35 Z M65,0 L7,0 C5.343,0 4,1.343 4,3 L4,61 C4,62.657 5.343,64 7,64 L65,64 C66.657,64 68,62.657 68,61 L68,3 C68,1.343 66.657,0 65,0 L65,0 Z M62,64 L10,64 L10,6 L62,6 L62,64 L62,64 Z" id="Shape"></path>\n                    <rect id="Rectangle-1" x="0" y="59" width="10" height="5"></rect>\n                    <rect id="Rectangle-2" x="62" y="59" width="10" height="5"></rect>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>\n';

describe('Using exported functions', function () {
    it('creates a builder', function () {
        var builder = _create$add.create();
        _assert.assert.equal(builder.opts.id, 'svg-%f');
    });
    it('Adds files', function () {
        var builder = _create$add.create();
        builder.add({ key: 'wergtert/book.svg', content: input1 });
        _assert.assert.equal(builder.items.length, 1);
        _assert.assert.equal(builder.items[0].id, 'svg-book');
    });
    it('Adds files with custom id', function () {
        var builder = _create$add.create({ id: 'icon-svg-%f' });
        builder.add({ key: 'wergtert/book.svg', content: input1 });
        _assert.assert.equal(builder.items.length, 1);
        _assert.assert.equal(builder.items[0].id, 'icon-svg-book');
    });
    it('Adds multiple files', function () {
        var builder = _create$add.create();
        builder.add({ key: 'wergtert/newtab.svg', content: input1 });
        builder.add({ key: '/wergw/wreggwergtert/book.svg', content: input2 });
        _assert.assert.equal(builder.items.length, 2);
        _assert.assert.equal(builder.items[0].id, 'svg-newtab');
        _assert.assert.equal(builder.items[1].id, 'svg-book');
    });
    it('Parses xml', function () {
        var builder = _create$add.create();
        builder.add({ key: 'wergtert/newtab.svg', content: input1 });
        return _parse$build.parse({
            item: builder.items[0]
        }).then(function (result) {
            _assert.assert.ok(result.symbol);
            _assert.assert.equal(result.symbol.$.id, 'svg-newtab');
            _assert.assert.equal(result.symbol.$.viewBox, '0 0 64 64');
        });
    });
    it('builds from parsed', function () {
        var builder = _create$add.create();
        builder.add({ key: 'wergtert/newtab.svg', content: input1 });
        return _parse$build.parse({
            item: builder.items[0]
        }).then(function (item) {
            var built = _parse$build.build({ item: item });
            var line = built.split('\n')[0];
            _assert.assert.equal(line, '<symbol viewBox="0 0 64 64" id="svg-newtab">');
        });
    });
    it('Compiles many into a single sheet', function () {
        var builder = _create$add.create();
        builder.add({ key: 'wergtert/newtab.svg', content: input1 });
        builder.add({ key: 'wergtert/sync.svg', content: input2 });
        return builder.compile().then(function (out) {
            console.log(out);
        })['catch'](function (err) {
            console.log(err);
        });
    });
});