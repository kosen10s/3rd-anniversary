import gulp from 'gulp';
import serve from 'gulp-webserver';
import gulpPug from 'gulp-pug';
import sass from 'gulp-sass';
import compass from 'compass-importer';
import plumber from 'gulp-plumber';
import marked from 'marked';
import pug from 'pug';
import fs from 'fs'
import browserify from 'browserify';
import babelify from 'babelify';
import minifyify from 'minifyify'
import source from 'vinyl-source-stream';
import inlineCss from 'gulp-inline-css';

pug.filters.markdownInclude = function (str) {
  return marked(str);
}

gulp.task('watch', () => {
  gulp.watch(["src/*.pug", "src/**/*.pug", "src/**/*.md"], ['pug']);
  gulp.watch(["src/sass/*.scss", "src/sass/**/*.scss"], ["sass"]);
});

gulp.task('pug', () => {
  gulp.src('src/*.pug')
    .pipe(plumber())
    .pipe(gulpPug({
      pug: pug
    }))
    .pipe(gulp.dest('./docs/'));
});

gulp.task('sass', () => {
  gulp.src('./src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: ["app/bower_components/bootstrap-sass/assets/stylesheets"],
      importer: compass
    }))
    .pipe(gulp.dest('./docs/css'));
});

gulp.task('browserify', () => {
  browserify({
    entries: ['./src/js/app.babel.js'],
    debug: true
  })
    .transform(babelify)
    .plugin(minifyify, { output: './docs/js/app.babel.js' })
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
      this.emit("end");
    })
    .pipe(source("app.babel.js"))
    .pipe(gulp.dest("./docs/js/"));
});

gulp.task('serve', () => {
  gulp.src('docs/')
    .pipe(serve({
      livereload: true,
      open: true
    }));
});
gulp.task("default", ['sass', 'pug', 'browserify', 'serve', 'watch']);
gulp.task("docs", ['sass', 'pug', 'browserify', 'serve']);
