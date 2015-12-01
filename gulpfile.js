var gulp              = require('gulp');
var concat            = require("gulp-concat");
var sass              = require('gulp-sass');
var ngHtml2Js         = require("gulp-ng-html2js");
var livereload        = require('gulp-livereload');
var connectlr         = require('connect-livereload')();

var EXPRESS_PORT      = 4000;
var EXPRESS_ROOT      = __dirname;
var LIVERELOAD_PORT   = 35729;

// Let's make things more readable by
// encapsulating each part's setup
// in its own method
function startExpress() 
{
  var express = require('express');
  var app = express();
  app.use(connectlr);
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}

// We'll need a reference to the tinylr
// object to send notifications of file changes
// further down

function startLivereload() 
{
  livereload.listen();
}

// Notifies livereload of changes detected
// by `gulp.watch()` 
function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });

}

gulp.task('html', function() 
{
  livereload.reload()
});

gulp.task('js', function () 
{
  gulp.src('./app/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
    .pipe(livereload());
});


// Default task that will be run
// when no parameter is provided
// to gulp
gulp.task('default', function () {

  startExpress();
  startLivereload();
  gulp.watch('index.html', ['html']);
  gulp.watch(['./app/**/*.js'], ['js']);

  //gulp.watch(['./app/**/*.html'], ['templates']);
  //gulp.watch(['./scss/**/*.scss'], ['scss']);
  

});