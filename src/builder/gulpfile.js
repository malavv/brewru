/*global require*/
(function() {
  'use strict';

  var
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    del  = require('del'),
    gulp = require('gulp'),
    merge = require('merge-stream'),
    replace = require('gulp-replace'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    sync = require('browser-sync').create(),
    ts = require('gulp-typescript'),
    tsLint = require('gulp-tslint'),
    vulcanize = require('gulp-vulcanize');

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

  gulp.task('default', ['dev']);

  /** Recreates a distribution package. */
  gulp.task('prod', ['copy', 'vulcanize']);
  gulp.task('dev', ['copy:lib', 'serve:dev', 'compile']);

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
    sync.init({ server: { baseDir: 'dist/' }});
    gulp.watch(paths.allDist).on('change', sync.reload);
  });

  /** Allows serving the static pages right from here. */
  gulp.task('serve:dev', [], function () {
    sync.init({ server: { baseDir: '.' }});
    gulp.watch(paths.pages.concat(['lib/brew/brew.js', 'elements/**/*.js'])).on('change', sync.reload);
    gulp.watch(['../client-core/release/lib/*.js'], ['copy:lib']);
    gulp.watch(['elements/**/*.ts'], ['compile:ts']);
  });
})();