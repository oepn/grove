/* eslint-disable no-var */
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var watch = require('gulp-watch');

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var csswring = require('csswring');
var del = require('del');
var path = require('path');

// Config
// - - - - - - - - - - - - - - - -

var paths = {
    npm: path.join(__dirname, 'node_modules'),
    src: path.join(__dirname, 'resources/assets'),
    public: path.join(__dirname, 'public/assets')
};

var inProduction = util.env.production;

var cssProcessors = [
    autoprefixer
];

if (inProduction) {
    cssProcessors = cssProcessors.concat(
        csswring({preserveHacks: true})
    );
}

// Tasks
// - - - - - - - - - - - - - - - -

gulp.task('clean', function() {
    return del([paths.public + '/**', '!' + paths.public]);
});

var styles = function() {
    gulp.src(paths.src + '/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [paths.npm],
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(postcss(cssProcessors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.public + '/css'));
};
gulp.task('styles', ['clean'], styles);
gulp.task('styles-watch', styles);

gulp.task('browser-sync', function() {
    browserSync({
        files: [
            'app/**/*',
            'resources/views/**/*',
            paths.public + '/**/*'
        ],
        watchOptions: {
            ignored: '**/*.map'
        },
        proxy: '127.0.0.1:8000',
        port: 3000,
        open: true,
        notify: true,
        reloadOnRestart: true
    });
});

gulp.task('watch', ['browser-sync'], function() {
    watch(paths.src + '/sass/**/*.scss', function() {
        gulp.start('styles-watch');
    });
});

gulp.task('build', ['styles']);
gulp.task('default', ['build']);
