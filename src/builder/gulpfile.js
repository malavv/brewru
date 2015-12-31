/*global require*/
(function() {
  'use strict';

  var
    bower = require('gulp-bower'),
    sync = require('browser-sync').create(),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    del  = require('del');

  var paths = {
    pages: ['elements/**/*.html', 'elements/*.html', 'index.html'],
    allDist: ['dist/index.html', 'dist/img/**/*', 'dist/data/**/*'],
    images: 'img/**/*',
    data: 'data/**/*',    
    distImages: 'dist/img/',
    distData: 'dist/data/'
  };

  var project = ts.createProject({
    declaration: true,
    noImplicitAny: true
  });

  var
    replace = require('gulp-replace'),
    $ = require('gulp-load-plugins')(),
    clean = require('gulp-clean'),
    del  = require('del'),
    concat = require('gulp-concat'),
    sync = require('browser-sync'),
    connect = require('gulp-connect'),
    runSequence = require('run-sequence'), 
    reload = sync.reload,
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    path = require('path'),
    merge = require('merge-stream'),
    glob = require('glob'),
    ts = require('gulp-typescript'),
    tsLint = require('gulp-tslint'),
    IOWA = require('./package.json').iowa,
    historyApiFallback = require('connect-history-api-fallback');

  gulp.task('default', ['dev']);

  /** Recreates a distribution package. */
  gulp.task('prod', ['copy', 'vulcanize']);
  gulp.task('dev', ['serve:dev', 'compile']);

  /** Updates bower if needed. */
  gulp.task('init', function() { return bower({ cmd: 'update'}); });

  /** Cleans the distribution folder. */
  gulp.task('clean', ['clean:js', 'clean:dist']);
  gulp.task('clean:js', function () { return del(['elements/**/*.js']); });
  gulp.task('clean:dist', function () { return del(['dist/']); });

  /** Copies resources */
  gulp.task('copy', ['copy:img', 'copy:data', 'copy:lib']);
  gulp.task('copy:img', function () { return gulp.src(paths.images).pipe(gulp.dest(paths.distImages)); });
  gulp.task('copy:data', function () { return gulp.src(paths.data).pipe(gulp.dest(paths.distData)); });
  gulp.task('copy:lib', function () {
    return gulp.src('../client-core/release/lib/*')
        .pipe(replace('src/defs/', '../'))
        .pipe(gulp.dest('lib/brew'));
  });

  /** Compiles Intermediary Languages */
  gulp.task('compile', ['compile:ts']);
  gulp.task('compile:ts', ['clean:js', 'lint:ts'], function() { return gulp.src('elements/**/*.ts').pipe(ts(project)).js.pipe(gulp.dest('elements')); });

  gulp.task('lint:ts', function () {
    return gulp.src('elements/**/*.ts')
      .pipe(tsLint())
      .pipe(tsLint.report('verbose'));
  });

  /**
   * Vulcanize this web application.
   *
   * This means that all the pages and code will be merged in one single
   * file.
   */
  gulp.task('vulcanize', function () {
    return gulp.src('index.html')
      .pipe(vulcanize({
        stripComments: true,
        inlineCss: true,
        inlineScripts: true
      }))
      .pipe(size())
      .pipe(gulp.dest('dist/'));
  });

  /** Serves the distribution version. */
  gulp.task('serve:dist', ['dist'], function () {
    browserSync.init({ server: { baseDir: 'dist/' }});
    gulp.watch(paths.allDist).on('change', browserSync.reload);
  });
  /** Allows serving the static pages right from here. */
  gulp.task('serve:dev', [], function () {
    sync.init({ server: { baseDir: '.' }});
    gulp.watch(paths.pages.concat(['lib/brew/brew.js', 'elements/**/*.js'])).on('change', sync.reload);
    gulp.watch(['../client-core/release/lib/*.js'], ['copy:lib']);
    gulp.watch(['elements/**/*.ts'], ['compile:ts']);
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

  // Copy All Files At The Root Level
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

    return merge(bower, scripts, styles, elements, vulcanized)
      .pipe($.size({title: 'copy'}));
  });

  // Lint JavaScript
  gulp.task('lint', function () {
    return gulp.src('elements/**/*.ts')
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
  });


})();