// Define Dependencies
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");

// Define global Typescript Project
var tsProject = ts.createProject("tsconfig.json");

// Define tasks
gulp.task("tsc-lint", function () {
    return gulp.src("src/**/*.ts")
        .pipe(tslint({formatter: "verbose"}))
        .pipe(tslint.report());
});

gulp.task("tsc", ["tsc-lint"], function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts());

    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("lib"));
});

gulp.task("default", ["tsc"]);
