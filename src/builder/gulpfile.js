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
    rename = require('gulp-rename'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    sync = require('browser-sync').create(),
    ts = require('gulp-typescript'),
    tsd = require('gulp-tsd'),
    tsLint = require('gulp-tslint'),
    htmlmin = require('gulp-htmlmin'),
    vulcanize = require('gulp-vulcanize');

  var p = {
    elements: 'elements',
    core: 'core',
    dist: 'dist',
    lib: 'lib',
    brew: 'brew',
    allHtml: '**/*.html',
    allTs: '**/*.ts',
    allJs: '**/*.js',
    index: 'index.html',
    pages: ['elements/**/*.html', 'elements/*.html', 'index.html'],
    allDist: ['dist/index.html', 'dist/img/**/*', 'dist/data/**/*'],
    images: 'img/**/*',
    data: 'data/**/*',
    distImages: 'dist/img/',
    distData: 'dist/data/'
  };

  var
    elementsProj = ts.createProject({
      declaration: true,
      noImplicitAny: true
    }),
    coreProj = ts.createProject({
      declaration: true,
      noExternalResolve: true,
      noImplicitAny: true
    });

  gulp.task('default', ['dev']);

  /** Recreates a distribution package. */
  gulp.task('prod', ['copy', 'vulcanize']);
  gulp.task('dev', [ 'serve:dev']);

  /** Updates bower if needed. */
  gulp.task('init', ['init:bower', 'init:tsd']);
  gulp.task('init:bower', function() { return bower({ cmd: 'update'}); });
  gulp.task('init:tsd', function (callback) {
    tsd({ command: 'reinstall', config: './tsd.json' }, callback);
  });

  /** Cleans the distribution folder. */
  gulp.task('clean', ['clean:elements', 'clean:core', 'clean:dist']);
  gulp.task('clean:elements', function () { return del([p.elements + '/' + p.allJs]); });
  gulp.task('clean:core', function () { return del([p.lib + '/' + p.brew]); });
  gulp.task('clean:dist', function () { return del([p.dist]); });

  gulp.task('lint:elements', function () {
    return gulp.src(p.elements + '/' + p.allTs)
      .pipe(tsLint())
      .pipe(tsLint.report('verbose'));
  });
  gulp.task('lint:core', function () {
    return gulp.src(p.core + '/' + p.allTs)
      .pipe(tsLint())
      .pipe(tsLint.report('verbose'));
  });

  /** Compiles Intermediary Languages */
  gulp.task('compile', ['compile:core', 'compile:elements']);
  gulp.task('compile:elements', ['compile:core'], function() {
    return gulp.src(p.elements + '/' + p.allTs)
      .pipe(ts(elementsProj))
      .js.pipe(gulp.dest(p.elements));
  });

  gulp.task('watch:elements', function() {
    gulp.watch(['elements/**/*.ts'], ['lint:elements', 'compile:elements']);
  });


  gulp.task('compile:core', [], function(cb) {
    var tsData = gulp.src(p.core + '/' + p.allTs)
      .pipe(sourcemaps.init())
      .pipe(ts({
        sortOutput: true,
        declaration: true,
        target: 'es5',
        out: 'brew.js'
      }));
    var def = tsData.dts
        .pipe(replace('path="lib', 'path="..'))
        .pipe(gulp.dest(p.lib + '/' + p.brew));
    var lib = tsData.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(p.lib + '/' + p.brew));
    return merge([def, lib]);
  });

  /** Allows serving the static pages right from here. */
  gulp.task('serve:dev', ['clean', 'lint:core', 'lint:elements', 'compile:core', 'compile:elements'], function () {
    sync.init({ server: { baseDir: '.' }});
    gulp.watch([
      p.index,
      p.elements + '/' + p.allHtml,
      p.elements + '/' + p.allJs,
      p.images,
      p.data,
      p.lib + '/' + p.brew + '/' + p.allJs
    ]).on('change', sync.reload);
    gulp.watch(['core/**/*.ts'], ['lint:core', 'compile:core']);
    gulp.watch(['elements/**/*.ts'], ['lint:elements', 'compile:elements']);
  });

  /** Copies resources */
  gulp.task('copy', ['copy:img', 'copy:data']);
  gulp.task('copy:img', function () { return gulp.src(p.images).pipe(gulp.dest(p.distImages)); });
  gulp.task('copy:data', function () { return gulp.src(p.data).pipe(gulp.dest(p.distData)); });

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
      .pipe(replace('`<body>`', ''))
      .pipe(size())
      .pipe(gulp.dest('dist/'));
  });

  /** Serves the distribution version. */
  gulp.task('serve:dist', ['prod'], function () {
    sync.init({ server: {
      baseDir: 'dist/'
    }});
    gulp.watch(p.allDist).on('change', sync.reload);
  });
})();
