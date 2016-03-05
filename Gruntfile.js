var path = require('path');
var fs = require('fs');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', '@*/grunt-*']});


    var pathConfig = {
        src:   path.resolve('src'),
        build: 'build',
        dist:  'dist',
        antetypeScripts: require(path.join(path.resolve('src'), 'custom_node_modules/index.js'))() + '/js'

    };



    var antetypeJSCoreScripts = function(){
        var coreScriptToLibs = {};
        coreScriptToLibs[pathConfig.dist + '/libs/AntetypeJSCore.js'] = [
            pathConfig.src + '/scripts/framework/utils/**.js',
            pathConfig.src + '/scripts/framework/core/**.js'
        ];

        return coreScriptToLibs;
    };

    var allStandaloneScripts = function(){
        var scripts = fs.readdirSync(pathConfig.src + '/scripts/standalone');

        var concatMappingFile = {};
        for(var i  in scripts){
            concatMappingFile[pathConfig.build + '/scripts/standalone/' + scripts[i]] = [
                //pathConfig.dist + '/libs/AntetypeJSCore.js',
                pathConfig.src + '/scripts/standalone/' + scripts[i]
            ];
        }

        return concatMappingFile;
    };


    grunt.initConfig({
        pgk:   grunt.file.readJSON("package.json"),
        paths: pathConfig,
        concat: {
            core: {
                files: antetypeJSCoreScripts()
            },
            dist: {
                files: allStandaloneScripts()
            }
        },
        clean:{
            antetypeScripts: {
                options: {
                    force: true
                },
                src: [
                    pathConfig.build + '/scripts/**',
                    pathConfig.dist + '/scripts/**',
                    pathConfig.antetypeScripts + '/**'
                ]
            }
        },
        copy: {
            scriptsToDist: {
                files: [
                    {
                        expand: true,
                        cwd: pathConfig.build + '/scripts/standalone/',
                        src: ["**"],
                        dest: pathConfig.dist + '/scripts'
                    }
                ]
            },
            scriptsToAntetype: {
                files: [
                    {
                        expand: true,
                        cwd: pathConfig.dist + '/scripts/',
                        src: ["**"],
                        dest: pathConfig.antetypeScripts
                    }
                ]
            },
            coreToAntetype: function() {

                if(process.env.HOME == '/Users/dominikbuhl') {
                    return {
                        files: [
                            {
                                expand: true,
                                cwd: pathConfig.dist + '/libs/',
                                src: ["AntetypeJSCore.js"],
                                dest: path.join(process.env.HOME, '/Ergosign/workspaces/hackathon/2016/antetype_repo/antetype/Prototyper\ Application')
                            }
                        ]
                    };
                }else{
                    return {};
                }
            }()
        },
        watch: {
            options: {
                spawn: false,
                livereload: false
            },
            scripts: {
                files: ['src/scripts/**/**.js'],
                tasks: ['moveScriptsToAntetype']
            }
        }
    });

    grunt.registerTask('moveScriptsToAntetype', ['concat', 'newer:copy:scriptsToDist', 'newer:copy:scriptsToAntetype','newer:copy:coreToAntetype']);
    grunt.registerTask('default', ['clean:antetypeScripts','moveScriptsToAntetype']);
    grunt.registerTask('run', ['default', 'watch']);
};