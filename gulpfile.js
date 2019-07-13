const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');

const jsSRC = './frontEnd/index.js';
const jsDIST = './filesServer/files/js/';
const jsWatch = './*.js';
const jsFILES = [jsSRC];

gulp.task('js' , async() => {
  jsFILES.map((file) =>
      browserify({
        entries: [file]
      })
          .transform( babelify , { presets: ['env']})
          .bundle()
          .pipe( source(file) )
          .pipe( rename({ extname: '.min.js'}))
          .pipe( buffer() )
          .pipe( sourcemaps.init({loadMaps: true}))
        //  .pipe( uglify())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest( jsDIST ))
  )
});