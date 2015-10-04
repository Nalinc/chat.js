
var pkg = require('./package.json');

var dist = pkg.micro.dist;
var source = pkg.micro.source;

var distapp = dist + "js/";
var distbinary = dist + "bin/"

var serverport = process.env.PORT || 8080;

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            main: {
                expand: true,
                cwd: distbinary,
                src: [
                    '**/*.js'
                ],
                dest: distbinary,
                ext: '.min.js'
            }
        },
        clean: {              
            dist: {               
                src: [
                    dist
                ]
            },
            tmp: {                               
                files: [
                        {
                            expand: true,
                            cwd: dist,
                            src: [
                                'app.config.js',
                                'app/**/*.js',
                                'app/**/*.tpl.html',
                                '!app/main.js',
                                '!app/rconfig.js'
                            ]
                        }
                ]    
            }
        },
        copy: {           
            dist: {
                files: [
                        {
                            expand: true,
                            cwd: source,
                            src: [
                          '**/*',
                                '!**/*.less'
                            ],
                            dest: dist
                        }
                ]
                
            }     
            
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: distapp,
                    mainConfigFile: distapp + 'rconfig.js',
                    name: "main",
                    optimize: 'none',                  
                    out: distbinary + 'libs-openudge-util.js',
                    done: function (done, output) {
                        console.log('Done requirejs');
                        done();
                    }
                }
            }
        },
        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: dist + 'styles',
              src: ['*.css'],
              dest: dist + 'styles',
              ext: '.css'
            }],
            options: {
              shorthandCompacting: false,
              roundingPrecision: -1
            }
          }
        },
        less:{
            main :{
                options: {
                    compress: false
                },
                files:[{
                        dest: dist + 'styles/style.css', 
                        src : source + 'styles/style.less'
                    }]
                }
        },
        useminPrepare: {
            html: source + 'index.html'
        },
        // Performs rewrites based on useminPrepare configuration
        usemin: {
            html: [dist + 'index.html'],
            options: {
                assetsDirs: [dist],
                //We need to include build:less block in html to replace less with css files
                blockReplacements: {
                    less: function (block) {
                        return '<link rel="stylesheet" href="' + block.dest + '" />';
                    }
                }
            }
        },
        bower: {
            install: {
              options: { 
                verbose: true,
                copy:false
              }             
            }
        },
        express: { 
            options: {
                port: serverport,
            },  
            dev: {
              options: {
                script: source + 'app.js',
                node_env: 'dev'
              }
            },
            prod: {
              options: {
                script: dist + 'app.js',
                node_env: 'prod'
              }
            }
        },
        replace: {
            less:{
              src: [dist + 'index.html'],
              overwrite : true,
              replacements: [
                {
                  from: '<script src="bower_components/less/dist/less.min.js"></script>',
                  to: ''
                }
              ]
            }
        },
        cleanempty: {	   
	    src: [distapp + '**/*'],
  	}

    });

    //Load grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-express-server');  
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');  
    grunt.loadNpmTasks('grunt-cleanempty');
    grunt.loadNpmTasks('grunt-bower-task');
    
    grunt.registerTask('express-keepalive', 'Keep grunt running', function(target) {
        var message = 'libs-openudge-util is running on http://localhost:' + serverport; 
        if (target == "dev") {
            message += " in development mode";
        } else {
            message += " in production mode";
        }
        console.log(message);
        this.async();       
    });


    //Default grunt task
    grunt.registerTask('build', [ 
        'bower:install', 
        'clean:dist', 
        'copy:dist',       
        'requirejs',
        'less', 
        'clean:tmp',
        'cleanempty',
        'uglify',
        'cssmin',
        'useminPrepare',
        'usemin',
    ]);
    
    grunt.registerTask('serve', function (target) {
        if (target === 'dev') {
            return grunt.task.run([ 
                'bower:install',                             
                'express:dev',
                'express-keepalive:dev'
            ]);
        }
        return grunt.task.run([
               'build',
               'express:prod',
               'express-keepalive:prod'
             ]);
      });

    
    grunt.registerTask('default', [ 
        'build'        
    ]);   

};