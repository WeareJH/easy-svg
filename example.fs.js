var fs  = require('fs');
var symb = require('./lib/index');

var builder = symb.create();

builder.add({key: './fixtures/bin.svg', content: fs.readFileSync('./fixtures/bin.svg', 'utf-8')});
builder.add({key: './fixtures/book.svg', content: fs.readFileSync('./fixtures/book.svg', 'utf-8')});

builder.compile().then(function (out) {
    fs.writeFileSync('./out.fs.svg', out);
}).catch(function (err) {
    console.error(err);
});
