'use strict';

function camelCase2Dash(str) {
    return  str.replace(/([A-Z])/g, function(_, letter, offset) {
        return offset ? '-' + letter.toLowerCase() : letter;
    });
}

function makeRegExp(type, directive) {
    var regex = '';
    if(type === 'attribute') {
        regex = '(?:\\s+)(' + directive  + ')(\\s*)([>=\\s])';
    } else if(type === 'opening-tag') {
        regex = '<(?:\\s*)(' + directive  + ')([^a-zA-Z0-9\\-\\:])(?:\\s*)(>)?';
    } else if(type === 'closing-tag') {
        regex = '(?:<\\/)(' + directive  + ')(?:\\s*)?>';
    } else {
        throw 'makeRegExp: Invalid type parameter';
    }
    return new RegExp(regex, 'g');
}

function makeReplacerFn(type, prefix) {
    var replacer = null;
    if(type === 'attribute') {
        replacer = function(_, p1, p2, p3) {
            var result = '';
            if(p3.indexOf('>') !== -1){
                result = ' ' + prefix + p1 + '>';
            } else if(p3.indexOf('=') !== -1) {
                result = ' ' + prefix + p1 + '=';
            } else {
                result =  ' ' + prefix + p1 + ' ';
            }
            return result;
        };
    } else if(type === 'opening-tag') {
        replacer = function(_, p1, p2, p3) {
            var result = '';
            if(p2 !== undefined && p2.indexOf('>') !== -1) {
                result = '<div ' + prefix + p1 + p2;
            } else if(p3 !== undefined && p3.indexOf('>') !== -1) {
                result = '<div ' + prefix + p1 + p3;
            } else {
                result = '<div ' + prefix + p1 + ' ';
            }
            return result;
        };
    } else if(type === 'closing-tag') {
        replacer = function() {
            return '</div>';
        };
    } else {
        throw 'makeReplacerFn: Invalid type parameter';
    }
    return replacer;
}

function uglify(type, directive, prefix, str) {
    var regex = '', replacerFn = null;
    try {
        regex = makeRegExp(type, directive);
        replacerFn = makeReplacerFn(type, prefix);
    } catch(e) {
        console.error('nghtml uglify error -> ' + e);
        process.exit(1);
    }
    return str.replace(regex, replacerFn);
}

module.exports = {
    'camelCase2Dash': camelCase2Dash,
    'makeRegExp': makeRegExp,
    'makeReplacerFn': makeReplacerFn,
    'uglify': uglify
};
