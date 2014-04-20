'use strict';

var _ = require('lodash'),
    util = require('./util');

module.exports = function(html, directives, prefix) {
    _.chain(directives.tags)
        .map(function(tag) {
            return util.camelCase2Dash(tag);
        })
        .forEach(function(tag) {
            html = util.uglify('opening-tag', tag, prefix, html);
            html = util.uglify('closing-tag', tag, prefix, html);
        });

    _.chain(directives.attributes)
        .map(function(attr) {
            return util.camelCase2Dash(attr);
        })
        .forEach(function(attr) {
            html = util.uglify('attribute', attr, prefix, html);
        });

    return html;
};
