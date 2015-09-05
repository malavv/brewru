'use strict';

var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  clean = require('gulp-clean'),
  del  = require('del'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync'),
  connect = require('gulp-connect'),
  runSequence = require('run-sequence'), 
  sass = require('gulp-sass'),
  reload = browserSync.reload,
  rename = require("gulp-rename"),
  replace = require("gulp-replace"),
  path = require('path'),
  merge = require('merge-stream'),
  glob = require('glob'),
  ts = require('gulp-typescript'),
  tsLint = require('gulp-tslint'),
  IOWA = require('./package.json').iowa,
  historyApiFallback = require('connect-history-api-fallback');

/* Cleans output directories. */
gulp.task('clean', del.bind(null, ['dist']));

// Watch Files For Changes & Reload
gulp.task('serve', ['clean', 'sass', 'ts'], function () {
  browserSync({
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.'],
      middleware: [ historyApiFallback() ],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['**/*.html'], reload);
  gulp.watch(['elements/**/*.scss'], ['sass', reload]);
  gulp.watch(['elements/**/*.ts'], ['ts', reload]);
});

/* Compiles the SCSS items inside the elem/ tree and puts the output in the app/ tree. */
gulp.task('sass', function () {
  return gulp.src('elements/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('elements'));
});

/* Compiles the polymer elements that will use the brewru library to implement the recipe builder functionalities. */
gulp.task('ts', function () {
  return gulp.src('elements/**/*.ts')
      .pipe(ts({
        noImplicitAny: true,
        target: 'es5'
        }))
      .js
      .pipe(gulp.dest('elements'));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('dist/bower_components'));

  var elements = gulp.src(['elements/**/*.html'])
    .pipe(gulp.dest('dist/elements'));
    
  var scripts = gulp.src(['elements/**/*.js'])
    .pipe(gulp.dest('dist/elements'));
    
  var styles = gulp.src(['elements/**/*.css'])
    .pipe(gulp.dest('dist/elements'));
    
  var vulcanized = gulp.src(['elements/elements.html'])
    .pipe($.rename('elements.vulcanized.html'))
    .pipe(gulp.dest('dist/elements'));

  return merge(app, bower, scripts, styles, elements, vulcanized)
    .pipe($.size({title: 'copy'}));
});

// Lint JavaScript
gulp.task('lint', function () {
  return gulp.src('app/elements/**/*.ts')
    .pipe(reload({stream: true, once: true}))
    .pipe(tsLint())
    .pipe(tsLint.report('verbose'));
});

// Optimize Library
gulp.task('lib', function () {
  return gulp.src('lib/**/*')
    .pipe(gulp.dest('dist/lib'))
    .pipe($.size({title: 'lib'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: ['dist']});

  return gulp.src(['**/*.html', '!{elements,test}/**/*.html'])
    // Replace path for vulcanized assets
    .pipe($.if('*.html', $.replace('elements/elements.html', 'elements/elements.vulcanized.html')))
    .pipe(assets)
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.cssmin()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Vulcanize imports
gulp.task('vulcanize', function () {
  var DEST_DIR = 'dist/elements';

  return gulp.src('dist/elements/elements.vulcanized.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: 'vulcanize'}));
});

gulp.task('default', ['clean'], function(cb) {
  runSequence(
    ['copy', 'sass', 'ts'],
    ['lint', 'html', 'lib'],
    'vulcanize',
    cb
  );
})
