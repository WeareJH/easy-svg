import {parseString, Builder} from 'xml2js';
import assign from 'object-assign';
import Q from 'q';
import SVGO from 'svgo';

let svgo = new SVGO();

svgo.config.plugins[2].push({
    type: 'perItem',
    active: true,
    name: 'removeAttrs',
    params: {
        attrs: ['fill']
    },
    fn (item, params) {
        item.eachAttr(function(attr) {
            if (params.attrs.indexOf(attr.name) > -1) {
                item.removeAttr(attr.name);
            }
        });
    }
});

const parseDefaults = {
    trim: true,
    valueProcessors: [(item) => item.trim()]
};

const builderDefaults = {
    headless: true
};

const svgoDefaults = {
    plugins: [
        {removeFill: true}
    ]
};

/**
 * @param item
 * @param opts
 * @returns {*|promise}
 */
function parseSvg({item, opts = {}}) {

    let deferred = Q.defer();

    svgo.optimize(item.content, (result) => {

        parseString(result.data, assign({}, parseDefaults, opts), (err, result) => {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve({
                result: result,
                transformed: transformParsedSvg({item, result})
            });
        });
    });

    return deferred.promise;
}

/**
 * Create an svg from a data obj
 * @param item
 * @param opts
 * @param cb
 */
function buildSvg({item, opts = {}, cb = () => {}}) {
    var builder = new Builder(assign({}, builderDefaults, opts));
    return builder.buildObject(item);
}

/**
 * Add viewbox and id to symbol element
 * @param item
 * @param result
 * @returns {{symbol: {$: {viewBox: viewBox, id: *}}}}
 */
function transformParsedSvg({item, result}) {

    let {height, width, viewBox} = result.svg.$;

    delete result.svg.$;

    let other = result.svg;

    let newsvg = {
        'symbol': {
            '$': {
                id: item.id
            }
        }
    };

    if (viewBox) {
        newsvg.symbol.$.viewBox = viewBox;
    } else {
        newsvg.symbol.$.viewBox = `0 0 ${width} ${height}`;
    }

    Object.keys(other).forEach((key) => newsvg.symbol[key] = other[key]);

    return newsvg;
}

export {parseSvg as parse}
export {buildSvg as build}
export {transformParsedSvg as process}
