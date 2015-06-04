var gulp = require('gulp');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var merge2 = require('merge2');
var angularTemplates = require('gulp-angular-templates');
var chmod = require('gulp-chmod');

var errorHandler = function() {
	var args = Array.prototype.slice.call(arguments);

	notify.onError({
		title: 'Compile Error',
		message: '<%= error %>'
	}).apply(this, args);

	this.emit('end');
};

gulp.task('jslibs', function() {
	var path = 'frontend/js/libs/';
	var src = [
		path + 'angular.min.js',
		path + 'angular-ui-router.min.js',
		path + 'angular-resource.min.js',
		path + 'modal.js'
	];

	gulp
		.src(src)
		.on('error', errorHandler)
		.pipe(concat('libs.min.js'))
		.pipe(chmod(755))
		.pipe(gulp.dest('public/js'));
});

gulp.task('jsapp', function() {
	var src = {
		app: 'frontend/js/app/**/*.js',
		templates: 'frontend/templates/**/*.html'
	};

	merge2(
		gulp.src(src.app),
		gulp.src(src.templates).pipe(angularTemplates({
			module: 'codebreaker'
		}))
	)
	.pipe(uglify())
	.on('error', errorHandler)
	.pipe(concat('app.min.js'))
	.pipe(chmod(755))
	.pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
	gulp.watch(['frontend/js/app/**/*.js', 'frontend/templates/**/*.html'], ['jsapp']);
});

gulp.task('default', ['watch']);