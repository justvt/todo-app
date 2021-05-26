let preprocessor = 'sass'; // Preprocessor (sass, scss, less, styl)
let fileswatch   = 'html,htm,txt,json,md,woff2'; // List of files extensions for watching & hard reload (comma separated)
let imageswatch  = 'jpg,jpeg,png,webp,svg'; // List of images extensions for watching & compression (comma separated)

const { src, dest, parallel, series, watch, lastRun } = require('gulp');
const sass         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const webp         = require('gulp-webp')
const del          = require('del');

// Local Server

function browsersync() {
	browserSync.init({
		server: { baseDir: 'app' },
		notify: false,
		// online: false, // Work offline without internet connection
	})
}

// Custom Styles

function styles() {
	return src('app/' + preprocessor + '/style.*')
	.pipe(eval(preprocessor)())
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}

// Scripts & JS Libraries

function scripts() {
	return src([
		// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
		'app/js/custom.js' // app.js. Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Minify JS (opt.)
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

 
// Images

function images() {
	return src('app/img/_src/**/*')
	.pipe(newer('app/img/dest'))
	.pipe(
		imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 2 // 0 to 7
		})
	)
	.pipe(dest('app/img/dest'))
	
}
function imagesWebp() {
	return src('app/img/_src/**/*')
	.pipe(
		webp({
			quality: 80
		})
	)
	
	.pipe(dest('app/img/webp'))
	
}

function cleanimg() {
	return del('app/img/dest/**/*', { force: true })
}

 
// Watching
 
function startwatch() {
	watch('app/' + preprocessor + '/**/*', styles);
	watch(['app/**/*.js', '!app/js/*.min.js'], scripts);
	// watch(['app/**/*.{' + imageswatch + '}'], imagesWebp);
	watch(['app/**/*.{' + imageswatch + '}'], images);
	watch(['app/**/*.{' + fileswatch + '}']).on('change', browserSync.reload);
	
}

exports.browsersync = browsersync;
exports.assets      = series(cleanimg, styles, scripts, images, imagesWebp);
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.imagesWebp  = imagesWebp;
exports.webp        = webp;
exports.cleanimg    = cleanimg;
exports.default     = parallel(images, imagesWebp, styles, scripts, browsersync, startwatch);
