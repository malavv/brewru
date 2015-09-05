'use strict';

var
  gulp = require('gulp'),
  clean = require('gulp-clean'),
  merge = require('merge2'),
  del  = require('del'),
  ts = require('gulp-typescript'),
  tsLint = require('gulp-tslint'),
  typedoc = require('gulp-typedoc'),
  karma = require('karma');

/* Cleans output directories. */
gulp.task('clean', del.bind(null, ['release']));

gulp.task('build', function () {
  var tsResult = gulp.src('src/**/*.ts')
    .pipe(ts({
        declaration: true,
        noExternalResolve: true,
        out: 'brew.js'
    }));
  
  return merge([
    tsResult.dts.pipe(gulp.dest('release/')),
    tsResult.js.pipe(gulp.dest('release/'))
  ]);
});

/* Generates documentation for Typescript. */
gulp.task('doc', function () {
  return gulp
      .src('src/**/*.ts')
      .pipe(typedoc({
        out: 'doc',
        target: 'es5',
        includeDeclarations: true
      }));
});

gulp.task('test', function(done) {
  new karma.Server({
    configFile: __dirname  + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// Lint JavaScript
gulp.task('tslint', function () {
  return gulp.src('src/**/*.ts')
    .pipe(tsLint())
    .pipe(tsLint.report('verbose'));
});

gulp.task('watch', ['clean', 'build', 'tslint'], function() {
    gulp.watch('src/**/*.ts', ['build', 'tslint']);
});