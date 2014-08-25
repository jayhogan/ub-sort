var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

gulp.task('default', ['build']);
gulp.task('build', ['browserify', 'uglify']);

gulp.task('browserify', function() {
  // TODO - Add file header
  return browserify({
      entries: './modules/index.js',
      standalone: 'ng-utility-belt',
      debug: true
    }).bundle()
    .pipe(source('ng-utility-belt.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', ['browserify'], function() {
  // TODO - Preserve file header comment (when added)
  return gulp.src('dist/ng-utility-belt.js')
    .pipe(uglify())
    .pipe(rename('ng-utility-belt.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
  // TODO - Test with mocha
});
