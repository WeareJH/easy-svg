var vfs  = require('vinyl-fs');
var fs  = require('fs');
var symb = require('./lib/index');

var builder = symb.create();

builder.add(fs.readWriteSync('./fixtures/bin.svg', 'utf-8'));
builder.add(fs.readWriteSync('./fixtures/block.svg', 'utf-8'));

builder.compile(function (err, out) {

});
