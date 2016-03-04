var path = require('path');
var fs = require('fs');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*']});


    var pathConfig = {
        src:   path.resolve('src'),
        build: 'build',
        dist:  'www',
        antetypeScripts: require(path.join(path.resolve('src'), 'custom_node_modules/index.js'))().pathToAntetypeScripts + '/js'

    };



    var allStandaloneScripts = function(){
        var scripts = fs.readdirSync(pathConfig.src + '/scripts/standalone');

        var concatMappingFile = {};
        for(var i  in scripts){
            concatMappingFile[pathConfig.build + '/scripts/standalone/' + scripts[i]] = [
                pathConfig.src + '/scripts/framework/utils/**.js',
                pathConfig.src + '/scripts/framework/core/**.js',
                pathConfig.src + '/scripts/standalone/' + scripts[i]
            ];
        }

        return concatMappingFile;
    };


    grunt.initConfig({
        pgk:   grunt.file.readJSON("package.json"),
        paths: pathConfig,
        concat: {
            dist: {
                files: allStandaloneScripts()
            }
        },
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
                        cwd: pathConfig.build + '/scripts/standalone/',
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
                tasks: ['concat', 'newer:copy:scriptsToAntetype']
            }
        }
    });

    grunt.registerTask('moveScriptsToAntetype', ['concat', 'newer:copy:scriptsToAntetype']);
    grunt.registerTask('default', ['clean:antetypeScripts','moveScriptsToAntetype']);
    grunt.registerTask('run', ['default', 'watch']);
};