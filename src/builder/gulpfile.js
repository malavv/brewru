var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var typedoc = require('gulp-typedoc');

gulp.task('default', ['watch', 'sass', 'typescript', 'base', 'html', 'typedoc']);

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('elem/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/elem'));
});

gulp.task('typescript', function() {
  return gulp.src('elem/**/*.ts')
    .pipe(ts({noImplicitAny: true}))
    .js
    .pipe(gulp.dest('app/elem'));
});
gulp.task('base', function() {
  return gulp.src('src/**/*.ts')
    .pipe(ts({
      noImplicitAny: true,
      out: 'base.js'
    }))
    .js
    .pipe(gulp.dest('app/lib/'));
});
gulp.task('html', function() {
  return gulp.src('elem/**/*.html')
    .pipe(gulp.dest('app/elem'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('elem/**/*.scss', ['sass']);
    gulp.watch('elem/**/*.ts', ['typescript']);
    gulp.watch('elem/**/*.html', ['html']);
    gulp.watch('src/**/*.ts', ['base']);
});

gulp.task('typedoc', function() {
    return gulp
        .src(['src/**/*.ts', 'elem/**/*.ts'])
        .pipe(typedoc({ 
            out: 'doc', 
            target: 'es5',
            includeDeclarations: true
        }));
});