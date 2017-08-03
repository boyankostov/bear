var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    uncss = require('gulp-uncss'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del'),
    browserSync = require('browser-sync'),
    util = require('gulp-util'),
    postcssImport = require('postcss-import'),
    postcssExtend = require('postcss-extend'),
    cssnano = require('gulp-cssnano'),
    cssnext = require('postcss-cssnext');
var jumpjs = require('jump.js');

// Clean
gulp.task('clean', function() {
  return del(['dist']);
});

// CSS
gulp.task('css', function () {
  var plugins = [
          postcssImport(),
          cssnext(),
          postcssExtend()
      ];
  return gulp.src('src/css/include.css')
        .pipe( postcss(plugins) )
        .on('error', swallowError)
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

// Getting rid of CSS not in use
gulp.task('uncss', ['css'], function () {
  return gulp.src('dist/css/include.css')
        .pipe(uncss({
            ignore: [
              /\.is-/,
              /\.has-/
            ],
            html: ['dist/*.html']
        }))
        .pipe(gulp.dest('dist/css'));
});

// Minifying CSS
gulp.task('cssnano', ['uncss'], function() {
  return gulp.src('dist/css/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('js', function() {
  return gulp.src(['src/js/plugins/*.js', 'node_modules/jump.js/dist/jump.js', 'node_modules/scrollreveal/dist/scrollreveal.js', 'node_modules/jump.js/jump.module.js', 'src/js/*.js'])
    .pipe(concat('main.js'))
    .on('error', swallowError)
    .pipe(gulp.dest('dist/js'))
    .pipe(rename('main.min.js'))
    .on('error', swallowError)
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

// Triggering a page reload on JS change
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// Set up image minification
gulp.task('images', function() {
  return gulp.src('src/img/**')
  .pipe(cache(imagemin({ optimizationLevel: 9, progressive: false, interlaced: false })))
  .pipe(gulp.dest('dist/img'))
  .pipe(browserSync.stream());
});

// Move files around
gulp.task('move-html', function() {
  console.log("Moving all HTML files in root folder");
  return gulp.src("src/*.html")
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.stream());
});

gulp.task('move-fonts', function() {
  console.log("Moving all font files in root folder");
  return gulp.src("src/fonts/*")
      .pipe(gulp.dest('dist/fonts/'))
      .pipe(browserSync.stream());
});

// Watch Files For Changes
gulp.task('watch', function() {
    browserSync.init({
        server: "./dist",
        notify: false
    });

    gulp.watch('src/js/*.js', ['js']);

    gulp.watch('src/css/**', ['css']);
    gulp.watch('src/*.html', ['move-html']);
    gulp.watch('src/fonts', ['move-fonts']);
    gulp.watch('src/img/**', ['images']);
    gulp.watch('src/js/**', ['js-watch']);
});

// Error Handling
function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString());
  util.beep();

  this.emit('end')
}

// Default Task
gulp.task('default', ['clean'], function() {
  gulp.start(['css', 'js', 'images', 'move-html', 'move-fonts']);
});
gulp.task('production', ['clean'], function() {
  gulp.start(['css', 'uncss', 'cssnano', 'js', 'images', 'move-html', 'move-fonts']);
});