var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*']});

    var pathConfig = {
        src:   path.resolve('src'),
        build: 'build',
        dist:  'www'
    };

    grunt.initConfig({
        pgk:   grunt.file.readJSON("package.json"),
        paths: pathConfig,
    });

    grunt.registerTask('default', []);
};