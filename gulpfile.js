var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

gulp.task('default', ['build']);

gulp.task('build', function() {
  gulp.src('modules/index.js')
    .pipe(browserify({
      standalone: 'ng-utility-belt',
      debug: true
    }))
    .pipe(rename('ng-utility-belt.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('test', function() {
  // TODO - Test with mocha
});