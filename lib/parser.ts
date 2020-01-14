import { parseString, Builder } from "xml2js";
import Q from "q";
import SVGO from "svgo";
import { basename } from "path";

const svgoDefaults = {
    plugins: [
        {
            removeFill: false
        }
    ]
};

let svgo = new SVGO(svgoDefaults as any);

(svgo as any).config.plugins[2].push({
    type: "perItem",
    active: true,
    name: "removeAttrs",
    params: {
        attrs: ["fill"]
    },
    fn(item, params) {
        item.eachAttr(function(attr) {
            if (params.attrs.indexOf(attr.name) > -1) {
                if (attr.value !== "none") {
                    item.removeAttr(attr.name);
                }
            }
        });
    }
});

const parseDefaults = {
    trim: true,
    valueProcessors: [item => item.trim()]
};

const builderDefaults = {
    headless: true
};

/**
 * @param item
 * @param opts
 * @returns {*|promise}
 */
function parseSvg({ item, opts = {} }): any {
    let deferred = Q.defer();

    try {
        svgo.optimize(item.content)
            .then(result => {
                parseString(
                    result.data,
                    {
                        ...parseDefaults,
                        ...opts
                    },
                    (err, result) => {
                        if (err) {
                            return deferred.reject(err);
                        }
                        deferred.resolve({
                            result: result,
                            transformed: transformParsedSvg({
                                item,
                                result
                            })
                        });
                    }
                );
            })
            .catch(e => {
                deferred.reject(createError(item, `SVGO: ${e}`));
            });
    } catch (e) {
        deferred.reject(createError(item, e.message));
    }

    return deferred.promise;
}

function createError(item, message) {
    const base = basename(item.key);
    const e = new Error(`${base}: ${message}`);
    const stack = (e.stack || "").split("\n");
    e.stack = [
        stack[0],
        ` File: ${base}`,
        ` Path: ${item.key}`,
        ` Msg:  ${message}`,
        ``
    ].join("\n");
    return e;
}

/**
 * Create an svg from a data obj
 * @param item
 * @param opts
 * @param cb
 */
function buildSvg({ item, opts = {}, cb = () => {} }) {
    var builder = new Builder({
        ...builderDefaults,
        ...opts
    });
    return builder.buildObject(item);
}

/**
 * Add viewbox and id to symbol element
 * @param item
 * @param result
 * @returns {{symbol: {$: {viewBox: viewBox, id: *}}}}
 */
function transformParsedSvg({ item, result }) {
    let { height, width, viewBox } = result.svg.$;

    delete result.svg.$;

    let other = result.svg;

    let newsvg = {
        symbol: {
            $: {
                id: item.id
            }
        }
    };

    if (viewBox) {
        (newsvg.symbol.$ as any).viewBox = viewBox;
    } else {
        (newsvg.symbol.$ as any).viewBox = `0 0 ${width} ${height}`;
    }

    Object.keys(other).forEach(key => (newsvg.symbol[key] = other[key]));

    return newsvg;
}

export { parseSvg as parse };
export { buildSvg as build };
export { transformParsedSvg as process };
