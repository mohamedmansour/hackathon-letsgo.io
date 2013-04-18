'use string';


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    source_path: 'public',
    build_path: 'build',

    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: [ '<%= source_path %>/javascripts/*.js' ],
	dest: [ '<%= build_path %>/javascripts/letsgo.io.js' ]
      },
      css: {
        src: [ '<%= source_path %>/stylesheets/*.css' ],
	dest: [ '<%= build_path %>/stylesheets/letsgo.io.css' ]
      }
    },
  
    uglify: {
      options: {
        mangle: true,
	banner: '/*! <%= pkg.title || pkg.name %> */'
      },
      js: {
        src: '<%= concat.js.dest %>',
	dest: '<%= build_path %>/javascripts/letsgo.io.min.js'
      }
    },

    cssmin: {
      css: {
        src: '<%= concat.css.dest %>',
	dest: '<%= build_path %>/stylesheets/letsgo.io.min.css'
      }
    }
  })


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
       
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};
