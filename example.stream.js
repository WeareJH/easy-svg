var vfs  = require('vinyl-fs');
var stream = require("./").stream;

vfs.src('fixtures/*.svg')
    .pipe(stream())
    .on('error', function (err) {
        console.log(err.stack);
    })
    .pipe(vfs.dest("./out"))
