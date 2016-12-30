var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var nested = require('postcss-nested');
var sugarss = require('sugarss');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
const eslint = require('gulp-eslint');
var ts = require('gulp-typescript');

var STYLE_TASK = "styles";
var SCRIPT_TASK = "scripts";
var VIEW_TASK = "views";
var ASSET_TASK = "assets";
var IMAGE_TASK = "images";

var stylepath = "stylesheet/*.sss";
var scriptpath = ["scripts/**/*.ts", "!scripts/def/*.*"];
var viewpath = "views/*.jade";

gulp.task(STYLE_TASK, function() {

    var plugins = [nested];
    return gulp.src(stylepath)
        .pipe(postcss(plugins, {
            parser: sugarss
        }))
        /*  .pipe(rename({
              extname: '.css'
          })).*/
        .pipe(concat("style.css"))
        .pipe(cssnano())
        .pipe(gulp.dest("dist"));

});


gulp.task(SCRIPT_TASK, function() {

    return gulp.src(scriptpath)
        //    .pipe(concat("Clever.js"))
        /*  .pipe(eslint({
          "rules":{
              "camelcase": 1
              }
          }))
          .pipe(eslint.result(result => {
             // Called for each ESLint result.
             console.log(`ESLint result: ${result.filePath}`);
             console.log(`# Messages: ${result.messages.length}`);
             console.log(`# Warnings: ${result.warningCount}`);
             console.log(`# Errors: ${result.errorCount}`);

             console.log(result.messages);
           }))*/
        //  .pipe(babel())
        //	  .pipe(uglify())

    .pipe(ts({
            noImplicitAny: true,
            out: "Clever.js",
            target: "ES5"
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task(VIEW_TASK, function() {

    var locals = require('./locals.json');

    return gulp.src(viewpath)
        .pipe(jade({
            locals: locals
        }))
        .pipe(gulp.dest("dist/views"));
});

gulp.task(IMAGE_TASK, function() {

    return gulp.src("./assets/icons/**")
			.pipe(imagemin())
			.pipe(gulp.dest("dist/icons"));

});

gulp.task(ASSET_TASK, function() {

    return gulp.src(["./assets/*.*", "./assets/fonts/*"], {
            "base": "./assets"
        })
        .pipe(gulp.dest("dist"));

});


gulp.task('watch', function() {

    gulp.watch(stylepath, [].concat(STYLE_TASK));
    gulp.watch(scriptpath, [].concat(SCRIPT_TASK));
    gulp.watch(viewpath, [].concat(VIEW_TASK));
    gulp.watch(assets, [].concat(ASSET_TASK));


});


gulp.task('default', function() {


    gulp.start(STYLE_TASK, SCRIPT_TASK, ASSET_TASK, IMAGE_TASK, VIEW_TASK);
});
