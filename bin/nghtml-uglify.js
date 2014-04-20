#!/usr/bin/env node
'use strict';

var program = require('commander'),
    fs = require('fs'),
    uglifyFile = require('../src/main');

program
    .version(require('../package.json').version)
    .usage('-c directives.json </path/to/input/file> </path/to/output/file>' +
           '\n\n  Debug: nghtml-uglify -c directives.json -d  <  </path/to/input/file>')
    .option('-p, --prefix  [value]', 'data-')
    .option('-d, --debug','Debug: process the given file from stdin, then output to stdout')
    .option('-c, --config', 'Config File: JSON formatted file consist of known directives')
    .parse(process.argv);

if(!program.prefix) {
    program.prefix = 'data-';
}

var nrArgs = program.args.length;

if(nrArgs === 0 || !program.config) {
    program.help();
}

var directives = JSON.parse(fs.readFileSync(program.args[0], 'utf8'));

if(nrArgs === 1 && program.debug) {
    var buffer = '';
    process.stdin.setEncoding('utf8');
    process.stdin.resume();

    process.stdin.on('data', function(chunk) {
        buffer += chunk;
    });

    process.stdin.on('end', function() {
        process.stdout.write(uglifyFile(buffer, directives, program.prefix));
    });
} else if(nrArgs === 3 && !program.debug) {
    var infile = program.args[1],
        outfile = program.args[2];

    try {
        var content = fs.readFileSync(infile, 'utf-8');
    } catch(e) {
        console.error('Error opening: ' + infile);
        process.exit(1);
    }
    try {
        fs.writeFileSync(outfile, uglifyFile(content, directives, program.prefix));
    } catch(e) {
        console.error('Error writing to: ' + outfile);
        process.exit(1);
    }
    process.exit(0);
} else {
    program.help();
}
