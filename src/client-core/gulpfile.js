'use strict';

var
  param = {
    dist: 'release',
    exploded: 'release/exploded',
    src: 'src/**/*.ts',
    distname: 'brew.js',
    distlib: 'release/lib',
    distdoc: 'release/doc'
  },

  concat = require('gulp-concat'),
  del  = require('del'),
  gulp = require('gulp'),
  merge = require('merge2'),
  sourcemaps = require('gulp-sourcemaps'),
  ts = require('gulp-typescript'),

  tsLint = require('gulp-tslint'),
  typedoc = require('gulp-typedoc'),
  karma = require('karma'),

  project = ts.createProject({
    declaration: true,
    noExternalResolve: true,
    noImplicitAny: true
  });

gulp.task('default', ['dist:clean', 'dist:build', 'dist:test', 'dist:doc']);

gulp.task('dist:clean', del.bind(null, [param.dist]));

// Used for live compiling and linting.
gulp.task('watch', ['dist:clean', 'dev:build', 'dev:lint', 'dist:build'], function() {
  gulp.watch(param.src, ['dev:build', 'dev:lint', 'dist:build']);
});

// Compiles for dev purposes. Not Prod.
gulp.task('dev:build', function () {
  var tsData = gulp.src(param.src)
    .pipe(ts(project));

  return merge([
    tsData.dts.pipe(gulp.dest(param.exploded)),
    tsData.js.pipe(gulp.dest(param.exploded))
  ])
});

// Compiles for production. Just def and lib.
gulp.task('dist:build', function () {
  var tsData = gulp.src(param.src)
    .pipe(sourcemaps.init())
    .pipe(ts({
      sortOutput: true,
      declaration: true,
      noExternalResolve: true,
      out: param.distname
    }));
  return merge([
    tsData.dts
      .pipe(gulp.dest(param.distlib)),
    tsData.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(param.distlib))
  ])
});

/* Generates documentation for Typescript. */
gulp.task('dist:doc', function () {
  return gulp
    .src(param.src)
    .pipe(typedoc({
      out: param.distdoc,
      target: 'es5',
      includeDeclarations: true
    }));
});

gulp.task('dev:lint', function () {
  return gulp.src(param.src)
    .pipe(tsLint())
    .pipe(tsLint.report('verbose'));
});

gulp.task('dist:test', function(done) {
  new karma.Server({
    configFile: __dirname  + '/karma.conf.js',
    singleRun: true
  }, done).start();
});