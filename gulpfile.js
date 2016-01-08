/* eslint-disable no-var */
var Promise = require('bluebird');

var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var order = require('gulp-order');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var watch = require('gulp-watch');

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var csswring = require('csswring');
var del = require('del');
var merge = require('merge-stream');
var modernizr = require('modernizr');
var path = require('path');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

// Helpers
// - - - - - - - - - - - - - - - -

function buildModernizr(config) {
    return new Promise(function(resolve) {
        modernizr.build(config, function(result) {
            var stream = source('modernizr.js');
            stream.end(result);
            resolve(stream.pipe(vinylBuffer()));
        });
    });
}

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
    var build = buildModernizr({
        options: [
            'setClasses'
        ],
        'feature-detects': [
            'test/css/flexbox',
            'touchevents'
        ]
    });

    build.then(function(stream) {
        merge(stream, gulp.src([
            paths.npm + '/fastclick/lib/fastclick.js',
            paths.src + '/js/init.js'
        ]))
            .pipe(order([
                'modernizr.js',
                'fastclick.js',
                'init.js'
            ]))
            .pipe(sourcemaps.init())
            .pipe(concat('app.min.js'))
            .pipe(gulpif(inProduction, uglify()))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.public + '/js'));
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
