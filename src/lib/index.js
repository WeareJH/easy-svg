import assert from 'assert';
import path   from 'path';
import assign from 'object-assign';
import {parse, build} from './parser.js';
import Q from 'q';

const defaults = {
    id: 'svg-%f'
};

class Symbols {

    /**
     * @param opts
     */
    constructor (opts) {
        this.opts  = assign({}, defaults, opts);
        this.items = [];
    }

    /**
     * @param {string} key
     * @param {string} content
     */
    add({key, content}) {
        assert(typeof key     === 'string', 'Key should be a string, like a filename');
        assert(typeof content === 'string', 'Content should be a string');

        this.items.push({
            key,
            content,
            id: this.makeId({key})
        });
    }

    /**
     * @param key
     * @returns {XML|string|void|*}
     */
    makeId ({key}) {
        return this.opts.id.replace('%f', path.basename(key, '.svg'));
    }

    /**
     * Compile all items
     */
    compile () {

        let proms = [];

        this.items.forEach((item) => proms.push(parse({item})));

        return Q.all(proms)
            .then(Symbols.wrapMany);
    }

    /**
     * @param items
     * @returns {*}
     */
    static wrapMany (items) {
        let wrapper = (all, item) => {
            all += (build({item}) + '\n');
            return all;
        };
        return Symbols.wrap(items.reduce(wrapper, ''));
    }

    static wrap (items) {
        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none">
    ${items}
</svg>`;
    }
}

function createSymbolBuilder (opts) {
    return new Symbols(opts);
}

export default createSymbolBuilder;

export {createSymbolBuilder as create};

export function myOtherFunction () {
    return "OK - Other";
}
