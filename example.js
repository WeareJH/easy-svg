var vfs  = require('vinyl-fs');
var file  = require('vinyl');
var fs  = require('fs');
var symb = require('./lib/index');

var builder = symb.create();

//builder.add({key: './fixtures/bin.svg', content: fs.readFileSync('./fixtures/bin.svg', 'utf-8')});
//builder.add({key: './fixtures/book.svg', content: fs.readFileSync('./fixtures/book.svg', 'utf-8')});

vfs.src('fixtures/*.svg')
    .pipe(require("through2").obj(function (file, enc, cb) {
        builder.add({key: file.path, content: file.contents.toString()});
        cb();
    }, function (cb) {
        var stream = this;

        builder.compile().then(function (out) {
            console.log(out);
            stream.push(new file({content: out, path: "out.svg", cwd: process.cwd()}));
            cb();
        }).catch(function (err) {
            console.log(err);
        })
    }))
    .pipe(vfs.dest("./"));


//builder.compile().then(function (out) {
//
//    fs.writeFileSync('./out.svg', out);
//
//}).catch(function (err) {
//
//    console.log(err);
//
//});
