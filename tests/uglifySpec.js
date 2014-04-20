'use strict';

var util = require('../src/util'),
    prefix = 'data-';

describe('Uglify Function in case of opening tag', function() {
    function uglify(raw, directive) {
        return util.uglify('opening-tag', directive, prefix, raw);
    }

    it('should replace directives in case of whitespace', function() {
        expect('<div data-tab>').toEqual(uglify('<tab>', 'tab'));
        expect('<div data-tab>').toEqual(uglify('< tab>', 'tab'));
        expect('<div data-tab>').toEqual(uglify('<tab >', 'tab'));
        expect('<div data-tab>').toEqual(uglify('< tab >', 'tab'));
        expect('<div data-tab>').toEqual(uglify('<tab	>', 'tab'));
        expect('<div data-tab>').toEqual(uglify('<	tab>', 'tab'));
        expect('<div data-tab>').toEqual(uglify('<	tab		>', 'tab'));
    });

    it('should only replace directives not attribute matches', function() {
        expect('<div data-tab tab-offset>').toEqual(uglify('<tab tab-offset>', 'tab'));
        expect('<div data-tab tab-offset="1">')
            .toEqual(uglify('< tab tab-offset="1">', 'tab'));
    });

    it('should only replace the requested not substring matches', function() {
        expect('<div data-tab tab-apple>').toEqual(uglify('<tab tab-apple>', 'tab'));
        expect('<div data-tab tab:apple="1">').toEqual(uglify('< tab tab:apple="1">', 'tab'));
    });

});

describe('Uglify Function  in case of closing tag', function() {
    function uglify(raw, directive) {
        return util.uglify('closing-tag', directive, prefix, raw);
    }

    it('should replace directives in case of whitespaces', function() {
        expect('</div>').toEqual(uglify('</tab>', 'tab'));
        expect('</div>').toEqual(uglify('</tab >', 'tab'));
        expect('</div>').toEqual(uglify('</tab	>', 'tab'));
        expect('</div>').toEqual(uglify('</tab    >', 'tab'));
    });
});

describe('Uglify Function in case of attribute', function() {
    function uglify(raw, directive) {
        return util.uglify('attribute', directive, prefix, raw);
    }

    it('should replace directives', function() {
        expect('<li data-tab>').toEqual(uglify('<li tab>', 'tab'));
        expect('<li data-tab="1">').toEqual(uglify('<li tab="1">', 'tab'));
    });

    it('should replace attribute directives with - character in it', function() {
        expect('<li data-tab-offset>').toEqual(uglify('<li tab-offset>', 'tab-offset'));
        expect('<li data-tab-offset="1">')
            .toEqual(uglify('<li tab-offset="1">', 'tab-offset'));
    });

    it('should not replace in substring cases', function() {
        expect('<div tabbed>').toEqual(uglify('<div tabbed>', 'tab'));
        expect('<div tabbed tab-apple tab:apple>')
            .toEqual(uglify('<div tabbed tab-apple tab:apple>', 'tab'));
    });

    it('should only replace attribute directives not elements', function() {
        expect('<tab data-tab-offset>').toEqual(uglify('<tab tab-offset>', 'tab-offset'));
        expect('<div data-tab-offset tab-apple >')
            .toEqual(uglify('<div tab-offset tab-apple >', 'tab-offset'));
        expect('<div data-tab-offset="1" >')
            .toEqual(uglify('<div tab-offset="1" >', 'tab-offset'));
        expect('< tab data-tab-offset="1">')
            .toEqual(uglify('< tab tab-offset="1">', 'tab-offset'));
    });

});
