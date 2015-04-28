## easy-svg [![Build Status](https://travis-ci.org/WeareJH/easy-svg.svg?branch=master)](https://travis-ci.org/WeareJH/easy-svg)

> A tiny plugin to help with the [svg + use workflow](http://www.wearejh.com/design/inline-svg-use-element/)

## Install

```bash
npm install easy-svg
```

## Usage

There's a through stream bundled, use with `vinyl-fs`   

```js
var vfs     = require('vinyl-fs');
var easysvg = require('easy-svg');

vfs.src('svg/*.svg')
    .pipe(easysvg.stream())
    .pipe(vfs.dest("./out"));
```

Or with gulp

```js
var gulp    = require('gulp');
var easysvg = require('easy-svg');

gulp.task('svg', function() {

    return gulp.src('svg/*.svg')
        .pipe(easysvg.stream())
        .pipe(gulp.dest("./out"));
});
```

Or directly from the file system

```js
var fs  = require('fs');
var easysvg = require('easy-svg');

var builder = easysvg.create();

builder.add({key: './fixtures/bin.svg', content: fs.readFileSync('./svg/bin.svg', 'utf-8')});
builder.add({key: './fixtures/book.svg', content: fs.readFileSync('./svg/book.svg', 'utf-8')});

builder.compile().then(function (out) {
    fs.writeFileSync('./icons.svg', out);
}).catch(function (err) {
    console.error(err);
});

```

## Options.
By default, 3 files will be produced

1. `icons.svg` - the compiled svg containing all of your SVG files 
2. `svgforeveyrone.min.js` - For IE 9 support
3. `preview.html` - For a preview of what was create

To disable any of theme:

```js
var vfs     = require('vinyl-fs');
var easysvg = require('easy-svg');

vfs.src('svg/*.svg')
    .pipe(easysvg.stream({
        js: false,
        preview: false
    }))
    .pipe(vfs.dest("./out"));
```

To change any file names:

```js
var vfs     = require('vinyl-fs');
var easysvg = require('easy-svg');

vfs.src('svg/*.svg')
    .pipe(easysvg.stream({
        js: 'js/ie9.js'
    }))
    .pipe(vfs.dest("./out"));
```


## Contributing.

This module is authored in ES6, so you should only edit files withing the `src` directory and compile 
using `npm run es6`. Alternatively, to compile on every file save, run `npm run es6-watch`.
