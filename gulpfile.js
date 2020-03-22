const gulp = require('gulp');
const cp = require('child_process');
const BrowserSync = require('browser-sync');

const browserSync = BrowserSync.create();
const webpackOptions = ['--colors', '--display-error-details'];
const hugoOptions = ['-v'];

function runHugo(options) {
  return cp.spawn('hugo', hugoOptions.concat(options || []), {
    stdio: 'inherit',
  });
}

function runWebpack(options) {
  return cp.spawn('yarn', ['webpack'].concat(webpackOptions, options || []),
    {
      stdio: 'inherit',
    });
}

function watch() {
  runWebpack(['--mode', 'development', '--watch']);
  runHugo(['--buildDrafts', '--buildFuture', '--watch']);
  browserSync.init({
    server: {
      baseDir: './public',
    },
  });
  gulp.watch('./public/**/*').on('change', browserSync.reload);
}

gulp.task('build', gulp.parallel(
  () => runWebpack(['--mode', 'production', '--profile']),
  () => runHugo(),
));

gulp.task('watch', watch);

exports.default = () => cp.spawn('yarn.cmd', ['-h'], {
  stdio: 'inherit',
});
