var
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    ts = require('gulp-typescript');

/* This default task is the one always run. Keep long items outside. */
gulp.task('default', [
  'html',
  'sass',
  'ts-base',
  'ts-elem'
]);

/* Cleans output directories. */
gulp.task('clean', function () {
  return gulp.src('app/elem')
      .pipe(clean());
});

/* Copies directly HTML to the app/ directory. */
gulp.task('html', function () {
  return gulp.src('elem/**/*.html')
      .pipe(gulp.dest('app/elem'))
      .pipe(connect.reload());
});

/* Compiles the SCSS items inside the elem/ tree and puts the output in the app/ tree. */
gulp.task('sass', function () {
  return gulp.src('elem/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('app/elem'))
      .pipe(connect.reload());
});

/* Compiles the brewru library and puts it as base.js, to be a library to the polymer elements. */
gulp.task('ts-base', function () {
  return gulp.src('src/**/*.ts')
      .pipe(ts({
        noImplicitAny: true,
        out: 'base.js'
      }))
      .js
      .pipe(gulp.dest('app/lib/'))
      .pipe(connect.reload());
});

/* Compiles the polymer elements that will use the brewru library to implement the recipe builder functionalities. */
gulp.task('ts-elem', function () {
  return gulp.src('elem/**/*.ts')
      .pipe(ts({noImplicitAny: true}))
      .js
      .pipe(gulp.dest('app/elem'))
      .pipe(connect.reload());
});

/* Generates documentation for Typescript. */
gulp.task('typedoc', function () {
  return gulp
      .src(['src/**/*.ts', 'elem/**/*.ts'])
      .pipe(typedoc({
        out: 'doc',
        target: 'es5',
        includeDeclarations: true
      }));
});

/* Watches certain files and activate processing if needed. */
gulp.task('watch', function () {
  connect.server({
    root: 'app',
    livereload: true
  });
  gulp.watch('elem/**/*.html', ['html']);
  gulp.watch('elem/**/*.scss', ['sass']);
  gulp.watch('src/**/*.ts', ['ts-base']);
  gulp.watch('elem/**/*.ts', ['ts-elem']);
});

