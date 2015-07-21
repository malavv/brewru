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
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', ['sass', 'images'], function () {
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
      baseDir: ['.tmp', 'app'],
      middleware: [ historyApiFallback() ],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/elements/**/*.scss'], ['sass', reload]);
  gulp.watch(['app/{src,elements}/**/*.ts'], ['tslint']);
  gulp.watch(['app/images/**/*'], reload);
});

/* Compiles the SCSS items inside the elem/ tree and puts the output in the app/ tree. */
gulp.task('sass', function () {
  return gulp.src('app/elements/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('app/elements'));
});

/* Compiles the brewru library and puts it as base.js, to be a library to the polymer elements. */
gulp.task('ts-base', function () {
  return gulp.src('app/src/**/*.ts')
      .pipe(ts({
        noImplicitAny: true,
        out: 'base.js',
        target: 'es5'
      }))
      .js
      .pipe(gulp.dest('app/lib/'));
});

/* Compiles the polymer elements that will use the brewru library to implement the recipe builder functionalities. */
gulp.task('ts-elem', function () {
  return gulp.src('app/elements/**/*.ts')
      .pipe(ts({
        noImplicitAny: true,
        target: 'es5'
        }))
      .js
      .pipe(gulp.dest('app/elements'));
});

/* Generates documentation for Typescript. */
// gulp.task('typedoc', function () {
//   return gulp
//       .src(['src/**/*.ts', 'elements/**/*.ts'])
//       .pipe(typedoc({
//         out: 'doc',
//         target: 'es5',
//         includeDeclarations: true
//       }));
// });

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
  var app = gulp.src([
    'app/*',
    '!app/test'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));

  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('dist/bower_components'));

  var elements = gulp.src(['app/elements/**/*.html'])
    .pipe(gulp.dest('dist/elements'));

  var vulcanized = gulp.src(['app/elements/elements.html'])
    .pipe($.rename('elements.vulcanized.html'))
    .pipe(gulp.dest('dist/elements'));

  return merge(app, bower, elements, vulcanized)
    .pipe($.size({title: 'copy'}));
});

// Lint JavaScript
gulp.task('tslint', function () {
  return gulp.src([
      'app/src/**/*.ts',
      'app/elements/**/*.ts'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe(tsLint())
    .pipe(tsLint.report('verbose'));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});
// Optimize Images
gulp.task('lib', function () {
  return gulp.src('app/lib/**/*')
    .pipe(gulp.dest('dist/lib'))
    .pipe($.size({title: 'lib'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', 'dist']});

  return gulp.src(['app/**/*.html', '!app/{elements,test}/**/*.html'])
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
    ['copy', 'sass', 'ts-base', 'ts-elem'],
    ['tslint', 'images', 'fonts', 'html', 'lib'],
    'vulcanize',
    cb
  );
})
