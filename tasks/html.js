'use strict';

var gulp = require('gulp');

gulp.task('html', 'Optimizes & refs assets referenced from HTML pages', function () {
    var $ = require('gulp-load-plugins')();
    var minifyHtml = require('gulp-htmlmin');
    var minifyCss = require('gulp-clean-css');
    var config = require('./__config.js');

    var version = config.pkg.version;
    var build = process.env.bamboo_buildNumber || process.env.BUILD_NUMBER || 'dev';
// bamboo_repository_branch_name  bamboo_planRepository_branchName
// bamboo_ManualBuildTriggerReason_userName
// bamboo_planRepository_revision

    // var assets = $.useref.assets({searchPath: ['.tmp', 'app', 'dist']});

    return gulp.src(['app/**/*.html', '!app/{elements,test}/**/*.html'])
        // Replace path for vulcanized assets (for Polymer projects)
        .pipe($.replace('elements/elements.html', 'elements/elements.vulcanized.html'))
        .pipe($.replace(/\{\{VERSION\}\}/g, version))
        .pipe($.replace(/\{\{BUILD\}\}/g, build))
        .pipe($.usemin({
            css: [ $.rev() ],
            html: [ function() {
                return minifyHtml({
                    removeComments: true,
                    preserveLineBreaks: true,
                    collapseWhitespace: true
                })
            } ],
            js: [
                //$.uglify,
                $.rev
            ],
            inlinejs: [ $.uglify ],
            inlinecss: [ minifyCss, 'concat' ]
        }))

        // .pipe(assets)
        // // Concatenate and minify JavaScript
        // .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
        // // Remove any unused CSS
        // .pipe($.if('*.css', $.uncss({
        //     html: [
        //         'app/index.html'
        //     ],
        //     // CSS Selectors for UnCSS to ignore
        //     ignore: [
        //         /.navdrawer-container.open/,
        //         /.app-bar.open/
        //     ]
        // })))
        // // Concatenate and minify styles
        // // In case you are still using useref build blocks
        // .pipe($.if('*.css', $.csso()))
        // .pipe(assets.restore())
        // .pipe($.useref())
        // // Update production Style Guide paths
        // .pipe($.replace('components/components.css', 'components/main.min.css'))
        // // Minify any HTML
        // .pipe($.if('*.html', $.minifyHtml({
        //     quotes: true,
        //     empty: true,
        //     spare: true
        // })))
        // Output files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});