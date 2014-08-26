var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var karma = require('karma').server;

gulp.task('default', ['build']);
gulp.task('build', ['browserify', 'uglify']);

gulp.task('browserify', function() {
  // TODO - Add file header
  return browserify({
      entries: './browser.js',
      standalone: 'ub-sort',
      debug: true
    }).bundle()
    .pipe(source('ub-sort.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', ['browserify'], function() {
  // TODO - Preserve file header comment (when added)
  return gulp.src('dist/ub-sort.js')
    .pipe(uglify())
    .pipe(rename('ub-sort.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});
