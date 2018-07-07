/*eslint-disable */
var gulp = require("gulp");

// Requires the gulp-sass plugin
var sass = require("gulp-sass");
/*eslint-enable */
gulp.task("default", ["sass-g", "sass", "watch"]);

// Global sass files
gulp.task("sass-g", function () {
	gulp.src("./src/app/scss/styles.scss")
		.pipe(sass().on("error", sass.logError)) // Using gulp-sass
		.pipe(gulp.dest("./src"));
});

// Sass files in the components
var sassFiles = "./src/**/*.scss",
	cssDest = ".";

gulp.task("sass", function () {
	gulp.src([sassFiles, "!./src/app/scss/*.scss"], {
		base: "."
	})
		.pipe(sass().on("error", sass.logError)) // Using gulp-sass
		.pipe(gulp.dest(cssDest));
});

gulp.task("watch", function () {
	gulp.watch(sassFiles, ["sass"]);
	gulp.watch("./src/app/scss/styles.scss", ["sass-g"]);
	// Other watchers
});


