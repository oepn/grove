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
var modernizr = require('modernizr');
var path = require('path');
var source = require('vinyl-source-stream');

// Config
// - - - - - - - - - - - - - - - -

var paths = {
    npm: path.join(__dirname, 'node_modules'),
    src: path.join(__dirname, 'resources/assets'),
    public: path.join(__dirname, 'public/assets')
};

var inProduction = process.env.NODE_ENV === 'production' || util.env.production;

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

gulp.task('clean', function(done) {
    del.sync([paths.public + '/**', '!' + paths.public]);
    done();
});

gulp.task('copy-assets', ['clean'], function() {
    return gulp.src([
            paths.src + '/files/**/*.*',
            paths.src + '/images/**/*.*'
        ], {base: paths.src})
        .pipe(gulp.dest(paths.public));
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
gulp.task('styles', ['copy-assets'], styles);
gulp.task('styles-watch', styles);

gulp.task('scripts', function() {
    modernizr.build({
        minify: true,
        options: [
            'setClasses'
        ],
        'feature-detects': [
            'test/css/flexbox'
        ]
    }, function(result) {
        var stream = source('modernizr.min.js');
        stream.end(result);
        stream.pipe(gulp.dest(paths.public + '/js'));
    });
});

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
        notify: false,
        reloadOnRestart: true
    });
});

gulp.task('watch', ['browser-sync'], function() {
    watch(paths.src + '/sass/**/*.scss', function() {
        gulp.start('styles-watch');
    });
});

gulp.task('build', ['styles', 'scripts']);
gulp.task('default', ['build']);
