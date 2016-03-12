var gulp = require('gulp');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');

var config = {
	srcPath: './src',
	imgPath: './src/img',
	nodeDir: './node_modules',
	destDir: './dist'
}

gulp.task('clean', function () {
return gulp.src(config.destDir, {read: false})
	.pipe(clean());
});

gulp.task('compile', function () {
return gulp.src(config.srcPath + '/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js',
		uglify()
	))
    .pipe(gulpif('*.css',
		sass({
			outputStyle: 'compressed',
			includePaths: [
	            config.nodeDir + '/bootstrap-sass/assets/stylesheets',
	            config.nodeDir + '/font-awesome/scss'
			]
		}),
		htmlmin({collapseWhitespace: true})
	))
    .pipe(gulp.dest(config.destDir));
});

gulp.task('images', function() {
return gulp.src(config.imgPath + '/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true, multipass: true })))
	.pipe(gulp.dest(config.destDir + '/img'))
});

gulp.task('copy', function() {
return gulp.src(config.srcPath + '/*.txt')
	.pipe(gulp.dest(config.destDir));
});

gulp.task('default', ['clean'], function() {
	gulp.start('compile', 'images', 'copy');
});
