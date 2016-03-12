var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var jshint = require('gulp-jshint');

var config = {
	htmlPath: './src',
	sassPath: './src/scss',
	jsPath: './src/js',
	imgPath: './src/img',
	nodeDir: './node_modules',
	destDir: './dist'
}

gulp.task('clean', function () {
return gulp.src(config.destDir, {read: false})
	.pipe(clean());
});

gulp.task('css', function() {
return gulp.src([config.nodeDir+'/normalize/normalize.css', config.sassPath+'/style.scss'])
	.pipe(
		sass({
			outputStyle: 'compressed',
	        includePaths: [
				config.sassPath + '/**/*',
	            config.nodeDir + '/bootstrap-sass/assets/stylesheets',
	            config.nodeDir + '/font-awesome/scss']
		})
		.on("error", notify.onError(function (error) {
			return "Error: " + error.message;})
		)
	)
	.pipe(gulp.dest(config.destDir + '/css'));
});

gulp.task('html', function() {
return gulp.src(config.htmlPath + '/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.destDir))
});

gulp.task('scripts', function() {
return gulp.src(config.jsPath+'/**/*')
	.pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.destDir + '/js'))
});

gulp.task('images', function() {
return gulp.src(config.imgPath + '/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true, multipass: true })))
	.pipe(gulp.dest(config.destDir + '/img'))
});

gulp.task('copy', function() {
return gulp.src(config.htmlPath + '/*.txt')
	.pipe(gulp.dest(config.destDir));
});

gulp.task('default', ['clean'], function() {
	gulp.start('css', 'html', 'scripts', 'images', 'copy');
});
