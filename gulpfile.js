var   gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		watch				= require('gulp-watch'),
		rigger			= require('gulp-rigger'),
		cheerio			= require('gulp-cheerio'),
		svgSprite		= require('gulp-svg-sprite'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		pngquant			= require('imagemin-pngquant'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		rsync          = require('gulp-rsync'),
		reload			= browserSync.reload;

var path = {
   build: { 
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		pic: 'dist/pic/',
		fonts: 'dist/fonts/',
	},
	src: {
		html: 'app/**/*.html',
		js: 'app/js/scripts.min.js',	//only 'main' files
		style: 'app/sass/main.sass',
		img: 'app/img/**/*.*',
		pic: 'app/pic/**/*.*',
		fonts: 'app/fonts/**/*.*',
	},
	watch: { 
		html: 'app/**/*.html',
		js: 'app/js/**/*.js',
		style: 'app/sass/**/*.sass',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*',
	},
   clean: 'dist', 
   outputDir: 'dist' 
 };

 var config = {
	server: {
		baseDir: "dist"
	},
	tunnel: false,
	host: 'localhost',
	port: 3000,
	logPrefix: "frontend_alex"
};


// Пользовательские скрипты проекта

gulp.task('webserver', function() {
	browserSync(config)
});

gulp.task('removedist', function() { return del.sync(path.clean); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('html:build', function() {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
		'app/libs/fancybox/dist/jquery.fancybox.min.js',
		'app/libs/maskedInput/maskedInput.min.js',
		'app/libs/slick/slick.js',
		'app/js/common.js',
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest(path.build.js))
	.pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest(path.build.css))
	.pipe(reload({stream: true}));
});

gulp.task('image:build', function() {
	return gulp.src(path.src.img)
	// .pipe(cache(imagemin())) // Cache Images
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({stream: true})); 
});

gulp.task('pic:build', function() {
	return gulp.src(path.src.pic)
	// .pipe(cache(imagemin())) // Cache Images
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(gulp.dest(path.build.pic))
	.pipe(reload({stream: true})); 
});

gulp.task('svg-sprite:build', function() {
	return gulp.src('app/img/svg-icons/*.svg')
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'image:build',
	'fonts:build',
	'pic:build',
	'svg-sprite:build'
]);


gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
});


gulp.task('default', ['build', 'watch', 'webserver']);
