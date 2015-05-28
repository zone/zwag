'use strict';

// Load Gulp and plugins
var gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    production  = !!$.util.env.production,
    path        = require('path'),
    del         = require('del'),
    browserSync = require('browser-sync'),
    browserify  = require('browserify'),
    through2    = require('through2'),
    paths       = {
        styles: {
            dist:  path.join('dist', 'styles'),
            src:   path.join('src', 'styles')
        },
        scripts: {
            dist:  path.join('dist', 'scripts'),
            src:   path.join('src', 'scripts')
        }
    },
    config      = {
        autoprefixer: {
            browsers: [
                'last 2 versions'
            ]
        },
        browserify: {
            cache: {},
            debug: !production,
            packageCache: {},
            fullPaths: false,
            extensions: ['.hbs']
        },
        browserSync: {
            server: {
                baseDir: './',
                proxy: 'zonebpgulp.dev'
            }
        },
        sass: {
            style: 'expanded',
            sourceComments: 'map',
            errLogToConsole: true
        }
    },
    errorLogger = function(error) {
        return $.util.log($.util.colors.red.bold('Error' + (error.plugin ? ': ' + error.plugin : '')), '\n\n' + error.message + '\n');
    };

$.stats(gulp);

// What mode?
$.util.log('Running in', (production ? $.util.colors.red.bold('production') : $.util.colors.green.bold('development')), 'mode');

// Styles
gulp.task('styles', function() {

    // @todo: Add sourcemaps once a fix is released for autoprefixer and sourcemaps.

    return gulp.src(path.join(paths.styles.src, '*.scss'))
        .pipe($.sass(config.sass))
            .on('error', errorLogger)
        .pipe($.autoprefixer(config.autoprefixer))
            .on('error', errorLogger)
        .pipe(production ? $.minifyCss() : $.util.noop())
        .pipe(gulp.dest(path.join(paths.styles.dist)))
        .pipe(browserSync.reload({ stream: true }));

});

// JSHint
gulp.task('jshint', function() {

    return gulp.src([
            path.join(paths.scripts.src, '**', '*.js'),
            '!' + path.join(paths.scripts.src, 'libs', '*.js'),
            '!' + path.join(paths.scripts.src, 'plugins', '*.js'),
            '!' + path.join(paths.scripts.src, '*.min.js'),
            '!' + path.join(paths.scripts.src, 'modernizr.js')
        ])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'));

});

// Scripts
gulp.task('scripts', function() {

    gulp.src(path.join(paths.scripts.src, 'app.js'))
    .pipe(through2.obj(function (file, enc, next){
            browserify(config.browserify)
                .add(file.path)
                .bundle(function(err, res){
                    // assumes file.contents is a Buffer
                    file.contents = res;
                    next(null, file);
                })
                .on('error', function(err) {
                    errorLogger(err);
                    this.emit('end');
                });
        }))
    .pipe(production ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(browserSync.reload({ stream: true }));

});

// Clean
gulp.task('clean', function(cb) {

    return del('dist', cb);

});

// Watch
gulp.task('watch', ['scripts', 'styles'], function() {

    // Create browserSync server
    browserSync(config.browserSync);

    // Watch .scss files
    gulp.watch(path.join(paths.styles.src, '**', '*.scss'), ['styles']);

    // Watch .js and .hbs files
    gulp.watch(path.join(paths.scripts.src, '**', '*.js'), ['jshint', 'scripts']);

    // Watch .html files
    gulp.watch(path.join('**', '*.html'), browserSync.reload);

    // Watch .hbs files
    gulp.watch(path.join('**', '*.hbs'), ['jshint', 'scripts']);

});

// Default
gulp.task('default', ['clean'], function() {

    return gulp.start(production ? ['scripts', 'styles'] : ['jshint', 'scripts', 'styles', 'watch']);

});
