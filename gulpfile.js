var gulp = require('gulp'),
    sass = require('gulp-sass'), //sass编译
    autoprefixer = require('gulp-autoprefixer'), //前缀补全
    minifyCss = require('gulp-minify-css'), //css压缩
    htmlmin = require('gulp-htmlmin'), // html 压缩
    base64 = require('gulp-base64'), //base64
    uglify = require('gulp-uglify'), //压缩js
    del = require('del'), //删除文件
    plumber = require('gulp-plumber'), //错误处理
    browserSync = require('browser-sync').create(), //Browsersync
    reload = browserSync.reload, //刷新
    gulpSequence = require('gulp-sequence'); //顺序执行

gulp.task('del', function(cb) {
    del(['dist'], cb);
})

gulp.task('html', function() {
    return gulp.src(['src/*.html'])
        .pipe(plumber())
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值
            removeEmptyAttributes: true, //删除所有空格作属性值
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('css', function() {
    return gulp.src(['src/sass/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('> 1%', 'last 9 versions', 'Firefox ESR', 'ios 5', 'android 2'))
        .pipe(minifyCss())
        .pipe(base64({
            maxImageSize: 8 * 1024
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({
            stream: true
        }))
});
gulp.task('js', function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('image', function() {
    return gulp.src(['src/images/*'])
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('watch', function() {
    //http server
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 8080
    });

    gulp.watch('src/images/*', ['image']);
    gulp.watch('src/sass/*', ['css']);
    gulp.watch('src/script/js/**/*.js', ['js']);
    gulp.watch('src/*.html', ['html']);
});

gulp.task('default', function(cb) {
    gulpSequence('del', 'image', 'css', 'js', 'html', 'watch', cb);
});