/**
 * Created by Cober on 2016/12/12.
 */
var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var spritesmith = require('gulp.spritesmith');
var replace = require('gulp-rev-replace');
var less = require('gulp-less');
var RevAll = require('gulp-rev-all');

var revAll = new RevAll();

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('compile', ['clean'], function () {

    var jsStream = gulp.src('src/static/scripts/**/*.js', {base: 'src/static'})
        .pipe(uglify());

    var lessStream = gulp.src('src/static/styles/**/*.less', {base: 'src/static'})
        .pipe(less());

    var cssStream = gulp.src('src/static/styles/**/*.css', {base: 'src/static'});

    var imgStream = gulp.src('src/static/images/**', {base: 'src/static'});

    var fontStream = gulp.src('src/static/fonts/**', {base: 'src/static'});

    return merge(jsStream, lessStream, cssStream, imgStream, fontStream)
        .pipe(revAll.revision())
        .pipe(gulp.dest('dist/static'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('dist/tmp'));
});

gulp.task('replace', ['compile'], function () {
    return gulp.src('src/views/**/*.hbs')
        .pipe(replace({manifest: gulp.src('dist/tmp/rev-manifest.json')}))
        .pipe(gulp.dest('dist/views'));
});

gulp.task('copy', ['clean', 'compile', 'replace'], function () {
    return gulp.src([
        'src/**',
        '!src/static/scripts/**',
        '!src/static/styles/**',
        '!src/static/images/**',
        '!src/views/**'
    ])
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean', 'compile', 'replace', 'copy'], function () {
    return del(['dist/tmp']);
});

gulp.task('sprite2', function () {
    var spriteData = gulp.src('src/static/images/sprite2/*.png').pipe(spritesmith({
        imgName: 'sprite2.png',
        imgPath: '../images/sprite2.png',
        cssName: 'sprite2.css',
        cssOpts: {
            cssSelector: function (item) {
                var name = (item.name || '').toLowerCase();
                name = name.replace('-hover', ':hover');
                name = name.replace('-checked',':checked');
                return '.sprite-' + name;
            }
        }
    }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('src/static/images/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('src/static/styles/'));

    return merge(imgStream, cssStream);
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/static/images/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.css',
        retinaSrcFilter: '**/*@2x.png',
        retinaImgName: 'sprite@2x.png',
        retinaImgPath: '../images/sprite@2x.png',
        cssOpts: {
            cssSelector: function (item) {
                var name = (item.name || '').toLowerCase();
                name = name.replace('-hover', ':hover');
                name = name.replace('-checked',':checked');
                return '.sprite-' + name;
            }
        }
    }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('src/static/images/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('src/static/styles/'));

    return merge(imgStream, cssStream);
});

gulp.task('default', ['clean', 'build']);