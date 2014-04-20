'use strict';

var util = require('../src/util'),
    directive = 'tab';

describe('camelCase 2 Dashed naming converter', function() {
    it('should convert camelCase to dashed naming scheme', function() {
        expect(util.camelCase2Dash('fooBar')).toBe('foo-bar');
        expect(util.camelCase2Dash('fooBarYaz')).toBe('foo-bar-yaz');
    });
});

describe('Regex Matcher for opening tag', function() {
    var regex = util.makeRegExp('opening-tag', directive);

    it('should match in case of single tag with or without white spaces', function() {
        expect('<tab>').toMatch(regex);
        expect('< tab>').toMatch(regex);
        expect('<  tab>').toMatch(regex);
        expect('<tab >').toMatch(regex);
        expect('<tab  >').toMatch(regex);
        // Tab + space
        expect('<         tab         >').toMatch(regex);
    });

    it('should match for tag with attributes, white spaces are insignificant', function() {
        expect('<tab offset="1">').toMatch(regex);
        expect('< tab offset="1">').toMatch(regex);
        expect('<  tab offset="1">').toMatch(regex);
        expect('<tab  offset="1">').toMatch(regex);
        expect('<tab   offset="1" >').toMatch(regex);
        // Tab + space
        expect('<         tab         offset="1"  >').toMatch(regex);
    });

    it('should not match in substring cases', function() {
        expect('<table>').not.toMatch(regex);
        expect('<tab1>').not.toMatch(regex);
        expect('<tab-ofset>').not.toMatch(regex);
    });

    it('should not match to closing tags', function() {
        expect('</tab myattr>').not.toMatch(regex);
        expect('</tab myattr="1" >').not.toMatch(regex);
        expect('</tab>').not.toMatch(regex);
        expect('</tab myattr>').not.toMatch(regex);
    });

    it('should not match to attributes', function() {
        expect('<div tab>').not.toMatch(regex);
        expect('<div tab="1" >').not.toMatch(regex);
    });

});

describe('Regex Matcher for closing tag', function() {
    var regex = util.makeRegExp('closing-tag', directive);

    it('should match in case of single tag with or without white spaces', function() {
        expect('</tab>').toMatch(regex);
        expect('</tab >').toMatch(regex);
        expect('</tab	>').toMatch(regex);
        // Tab + space
        expect('</tab    >').toMatch(regex);
    });

    it('should not match in substring cases', function() {
        expect('</table>').not.toMatch(regex);
        expect('</tab1 >').not.toMatch(regex);
        expect('</tab-ofset >').not.toMatch(regex);
    });

    it('should not tolerate invalid closing tags', function() {
        expect('</tab myattr>').not.toMatch(regex);
        expect('</tab myattr="1" >').not.toMatch(regex);
    });

    it('should not match to opening tags', function() {
        expect('<tab myattr>').not.toMatch(regex);
        expect('<tab>').not.toMatch(regex);
    });

    it('should not match to attributes', function() {
        expect('<div tab myattr>').not.toMatch(regex);
        expect('<div tab>').not.toMatch(regex);
    });

});

describe('Regex Matcher for attribute', function() {
    var regex = util.makeRegExp('attribute', directive);

    it('should match in case of single tag with or without white spaces', function() {
        expect('<div tab>').toMatch(regex);
        expect('<div tab="1">').toMatch(regex);
        expect('<div tab >').toMatch(regex);
        expect('<div	tab	>').toMatch(regex);
        // Tab + space
        expect('<div   tab   >').toMatch(regex);
    });

    it('should not match in substring cases', function() {
        expect('<div tabbed>').not.toMatch(regex);
        expect('<div tab1 >').not.toMatch(regex);
        expect('<div tab1="1" >').not.toMatch(regex);
        expect('<div tab-ofset >').not.toMatch(regex);
    });

    it('should find typo spaces(to be fixed by replacer!)', function() {
        expect('</tab myattr ="1" >').not.toMatch(regex);
    });

    it('should not match to opening tags', function() {
        expect('<tab>').not.toMatch(regex);
    });

    it('should not match to closing tags', function() {
        expect('</tab>').not.toMatch(regex);
    });

    it('should match to attributes with - char', function() {
        expect('<div tab-offset>').toMatch(util.makeRegExp('attribute', 'tab-offset'));
        expect('<div tab-offset >').toMatch(util.makeRegExp('attribute', 'tab-offset'));
        expect('<div tab-offset="1">').toMatch(util.makeRegExp('attribute', 'tab-offset'));
        expect('<div tab-offset tab-a >').toMatch(util.makeRegExp('attribute', 'tab-offset'));
    });

});
