var vfs  = require('vinyl-fs');
var stream = require("./").stream;

vfs.src('fixtures/invalid/random.svg')
// vfs.src('fixtures/invalid/empty.svg')
// vfs.src('fixtures/invalid/unclosed-tags.svg')
    .pipe(stream())
    .on('error', function (err) {
        console.log(err.stack);
    })
    .pipe(vfs.dest("./out"));
