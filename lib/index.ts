import assert from "assert";
import path from "path";
import stream from "./plugins/stream";
import { parse, build } from "./parser.js";
import Q from "q";

process.on("unhandledRejection", up => {
    throw up;
});

const defaults = {
    id: "svg-%f"
};

class Symbols {
    public items: any[];
    public opts: any;
    public compiled: {
        id: any;
    }[];

    /**
     * @param opts
     */
    constructor(opts) {
        this.opts = {
            ...defaults,
            ...opts
        };
        this.items = [];
        this.compiled = [];
    }

    /**
     * @param {string} key
     * @param {string} content
     */
    add({ key, content }) {
        assert(
            typeof key === "string",
            "Key should be a string, like a filename"
        );
        assert(typeof content === "string", "Content should be a string");

        this.items.push({
            key,
            content,
            id: this.makeId({
                key
            })
        });
    }

    /**
     * @param key
     * @returns {XML|string|void|*}
     */
    makeId({ key }) {
        return this.opts.id.replace("%f", path.basename(key, ".svg"));
    }

    /**
     * Compile all items
     */
    compile() {
        let proms: Promise<any>[] = [];

        this.items.forEach(item => {
            var parsed = parse({
                item
            });
            proms.push(parsed);
        });

        return Q.all(proms)
            .then(out => {
                return this.saveTransformed(out);
            })
            .then(this.wrapMany);
    }

    /**
     * @param items
     * @returns {*}
     */
    wrapMany(items) {
        let wrapper = (all, item) => {
            all +=
                build({
                    item: item.transformed
                }) + "\n";
            return all;
        };
        return Symbols.wrap(items.reduce(wrapper, ""));
    }

    static wrap(items) {
        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none">
    ${items}
</svg>`;
    }

    /**
     * Save the transformed data
     * @param out
     * @returns {*}
     */
    saveTransformed(out) {
        this.compiled = out.map(item => item.transformed.symbol.$);
        return out;
    }
}

function createSymbolBuilder(opts) {
    return new Symbols(opts);
}

export default createSymbolBuilder;

export { createSymbolBuilder as create };
export { stream };

export function myOtherFunction() {
    return "OK - Other";
}
