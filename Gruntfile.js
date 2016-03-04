var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*']});


    var pathConfig = {
        src:   path.resolve('src'),
        build: 'build',
        dist:  'www',
        antetypeScripts: require(path.join(path.resolve('src'), 'custom_node_modules/index.js'))().pathToAntetypeScripts + '/js'

    };

    grunt.initConfig({
        pgk:   grunt.file.readJSON("package.json"),
        paths: pathConfig,
        clean:{
            antetypeScripts: {
                options: {
                    force: true
                },
                src: [pathConfig.antetypeScripts + '/**']
            }
        },
        copy: {
            scriptsToAntetype: {
                files: [
                    {
                        expand: true,
                        cwd: pathConfig.src + '/scripts/standalone/',
                        src: ["**"],
                        dest: pathConfig.antetypeScripts
                    }
                ]
            }
        },
        watch: {
            options: {
                spawn: false,
                livereload: false
            },
            scripts: {
                files: ['src/scripts/**/**.js'],
                tasks: ['newer:copy:scriptsToAntetype']
            }
        }
    });

    grunt.registerTask('moveScriptsToAntetype', ['newer:copy:scriptsToAntetype']);
    grunt.registerTask('default', ['clean:antetypeScripts', 'moveScriptsToAntetype']);
    grunt.registerTask('run', ['default', 'watch']);
};