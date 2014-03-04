module.exports = function (grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
        options: {
            livereload: true
        },
        css: {
            files: 'app/scss/*',
            tasks: ['sass:demo']
        },
        js: {
            files: 'app/js/*',
            tasks: ['copy:js']
        },
        html: {
            files: ['app/*.html', 'app/*.php'],
            tasks: ['copy:html']
        },
        images: {
            files: 'app/imgs/*',
            tasks: ['copy:imgs']
        }
    },
    sass: {
        demo: {
            files: {
                'demo/css/selectadon-demo.css': 'app/scss/demo.scss'
            }
        },
        dist: {
            files: {
                'build/css/selectadon.css': 'app/scss/index.scss'
            }
        }
    },
    copy: {
        html: {
            files: [
                {
                    expand: true,
                    cwd: 'app',
                    src: ['*.html', '*.php'],
                    dest: 'demo/'
                }
            ]
        },
        js: {
            files: [
                {
                    expand: true,
                    cwd: 'app/js',
                    src: '**',
                    dest: 'demo/js/'
                },
                {
                    expand: true,
                    cwd: 'app/js',
                    src: '**',
                    dest: 'build/js/'
                }
            ]
        },
        imgs: {
            files: [
                {
                    expand: true,
                    cwd: 'app/imgs/',
                    src: '**',
                    dest: 'demo/imgs/'
                }
            ]
        }
    },
    uglify: {
        dist: {
            files: {
                'build/js/selectadon.min.js': ['app/js/selectadon.js']
            }
        }
    },
    connect: {
        server: {
            options: {
                hostname: 'localhost',
                base: 'demo/',
                livereload: true
            }
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['connect','watch']);
grunt.registerTask('demo', ['sass:demo', 'copy']);
grunt.registerTask('build', ['sass:dist', 'copy:js', 'uglify']);
};