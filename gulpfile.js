'use strict';

var gulp = require('gulp');

var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var browserSync = require('browser-sync').create();

gulp.task('html', function () {
  return gulp.src('index.html')
    .pipe(plugins.notify('Done HTML!'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

// при изменеии  js-файла
gulp.task('JavaScript', function () {
  return gulp.src('app/script.js')
    .pipe(plugins.notify('Done JavaScript!'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

gulp.task('html-watch', ['html'], function () {
    browserSync.reload;
});

// перезагрузка браузера при внесении изменений в js-файл
gulp.task('js-watch', ['JavaScript'], function () {
    browserSync.reload;
});

// запуск Browsersync и слежение за js-файлом
gulp.task('browser-sync', ['html', 'JavaScript'],  function() {
    browserSync.init({
        server: {
            proxy: "C:/apache/localhost/www/Scripts/game/"
        }
    });
    
    gulp.watch('index.html', ['html-watch']);
    gulp.watch('app/script.js', ['js-watch']);
});

gulp.task('default', ['browser-sync']);
