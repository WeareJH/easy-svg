var vfs  = require('vinyl-fs');
var file  = require('vinyl');
var symb = require('./lib/index');
var through2 = require('through2');

var builder = symb.create();

vfs.src('fixtures/*.svg')
    .pipe(through2.obj(function (file, enc, cb) {
        builder.add({key: file.path, content: file.contents.toString()});
        cb();
    }, function (cb) {
        var stream = this;
        builder.compile()
            .then(function (out) {
                stream.push(new file({contents: new Buffer(out), path: "out.stream.svg", cwd: process.cwd()}));
                cb();
            }).catch(function (err) {
                stream.emit('error', err);
                stream.emit('end');
                cb();
            });
    }))
    .pipe(vfs.dest("./"));
