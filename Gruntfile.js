'use strict';


/* packages.json
  "devDependencies": {
    "grunt": "0.4.1",
    "grunt-contrib-uglify": "0.2.0",
    "grunt-contrib-cssmin": "0.6.0",
    "grunt-contrib-concat": "0.2.0",
    "grunt-contrib-clean": "0.4.1",
    "grunt-contrib-copy": "0.4.1"
  }
*/  

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    source_path: 'public',

    clean: [ 
      "<%= source_path %>/javascripts/letsgo.io.*",
      "<%= source_path %>/stylesheets/letsgo.io.*" 
    ],

    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: [ '<%= source_path %>/javascripts/*.js' ],
        dest: [ '<%= source_path %>/javascripts/letsgo.io.js' ]
      },
      css: {
        src: [ '<%= source_path %>/stylesheets/*.css' ],
        dest: [ '<%= source_path %>/stylesheets/letsgo.io.css' ]
      }
    },

    uglify: {
      options: {
        mangle: true,
        banner: '/*! <%= pkg.title || pkg.name %> */'
      },
      js: {
        src: '<%= concat.js.dest %>',
        dest: '<%= source_path %>/javascripts/letsgo.io.min.js'
      }
    },

    cssmin: {
      css: {
        src: '<%= concat.css.dest %>',
        dest: '<%= source_path %>/stylesheets/letsgo.io.min.css'
      }
    }

  })


  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin']);

};
