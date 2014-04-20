module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'util.js',
                'bin/nghtml-uglify',
                'test/*.js'
            ]
        },
        jscs:{
            options: {
                config: '.jscs.json'
            },
            src: [
                'Gruntfile.js',
                'src/*.js',
                'bin/*.js',
                'test/*.js'
            ]
        },
        jasmineNode: {
            specNameMatcher: './test',
            projectRoot: '.',
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                savePath: './reports',
                useDotNotation: true,
                consolidate: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-jscs-checker');

    grunt.registerTask('test', ['jasmine_node']);
    grunt.registerTask('default', ['jshint','jscs','jasmine_node']);

};
