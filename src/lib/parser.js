import {parseString, Builder} from './xml2js/xml2js';
import assign from 'object-assign';
import Q from 'q';

const parseDefaults = {
    stripAttrs: ['id', 'fill']
};
const builderDefaults = {
    headless: true
};

/**
 * Parse an svg
 * @param item
 * @param opts
 * @param cb
 */
function parseSvg({item, opts = {}, cb = () => {}}) {
    let deferred = Q.defer();
    parseString(item.content, assign({}, parseDefaults, opts), function (err, result) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(transformParsedSvg({item, result}));
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
 * @returns {{symbol: {$: {viewBox: viewbox, id: *}}}}
 */
function transformParsedSvg({item, result}) {

    let viewbox = result.svg.$.viewBox;
    delete result.svg.$;
    let other = result.svg;
    let newsvg = {
        'symbol': {
            '$': {
                viewBox: viewbox,
                id: item.id
            }
        }
    };

    Object.keys(other).forEach(function (key) {
        newsvg.symbol[key] = other[key];
    });

    return newsvg;
}

export {parseSvg as parse}
export {buildSvg as build}
