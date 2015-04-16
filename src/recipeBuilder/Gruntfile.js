module.exports = function(grunt) {
	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'sass',
          cssDir: 'css'
        }
      }
    },
    watch: {
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      css: {
        files: ['sass/**/*.scss'],
        tasks: ['compass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['jshint']);
};