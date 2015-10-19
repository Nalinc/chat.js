
var pkg = require('./package.json');

var dist = pkg.micro.dist;
var source = pkg.micro.source;

var serverport = process.env.PORT || 5000;

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            main: {
                expand: true,
                cwd: dist,
                src: [
                    '**/*.js'
                ],
                dest: dist,
                ext: '.min.js'
            }
        },
        clean: {              
            dist: {               
                src: [
                    dist
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
        express: { 
            options: {
                port: serverport,
            },  
            dev: {
              options: {
                script: 'app.js',
                node_env: 'dev'
              }
            },
            prod: {
              options: {
                script: 'app.js',
                node_env: 'prod'
              }
            }
        },
        replace: {
            less:{
              src: [dist + 'index.html'],
              overwrite : true,
            }
        },
        cleanempty: {	   
	    src: [dist + '**/*'],
  	}

    });

    //Load grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-express-server');  
    grunt.loadNpmTasks('grunt-cleanempty');
    
    grunt.registerTask('express-keepalive', 'Keep grunt running', function(target) {
        var message = 'chat.js is running on http://localhost:' + serverport; 
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
        'clean:dist',
        'copy:dist', 
        'cleanempty',
        'uglify',
    ]);
    
    grunt.registerTask('serve', function (target) {
        if (target === 'dev') {
            return grunt.task.run([ 
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