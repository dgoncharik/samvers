"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var htmlmin = require("gulp-htmlmin");
var browserSync = require("browser-sync").create();
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var del =require("del");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var sourcemaps = require("gulp-sourcemaps");
var postscc = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var flatten = require('gulp-flatten');
var rollup = require('gulp-rollup');

var path = {
  build: {
    dir: "build",
    html: "build",
    css: "build/css",
    img: "build/img",
    fonts: "build/fonts",
    js: "build/js",
    other: "build/other"
    // plugins: "build/plugins"
  },
  source: {
    dir: "source",
    html: "source",
    style: "source/sass",
    img: "source/img",
    fonts: "source/fonts",
    js: "source/js",
    ico: "source",
    svgSprite: "source/img/svg-sprite",
    other: "source/other"
    // plugins: "source/plugins"
  }
}

gulp.task("refresh", function(done) {
  browserSync.reload();
  done();
})

gulp.task("clean", function() {
  return del(path.build.dir)
})

gulp.task("copy", function() {
  return gulp.src([
    path.source.fonts + "/**/*.{woff,woff2}",
    path.source.img + "/**/*.*",
    "!" + path.source.svgSprite + "/**", //не копировать папку с файлами для svg спрайта
    // path.source.js + "/**/*.js",
    path.source.ico + "/*.ico"
  ], {base: path.source.dir})
  .pipe(gulp.dest(path.build.dir))
});

gulp.task("copy-img", function() {
  return gulp.src([
    path.source.img + "/**/*.*",
    "!" + path.source.svgSprite + "/**", //не копировать папку с файлами для svg спрайта
  ])
  .pipe(gulp.dest(path.build.img))
})

gulp.task("html", function() {
  return gulp.src(path.source.html + "/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest(path.build.html))
});

gulp.task("html-min", function() {
  return gulp.src(path.source.html + "/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({collapseWhitespace: true})) //минификация html
  .pipe(gulp.dest(path.build.html))
});

gulp.task("css", function() {
  return gulp.src(path.source.style + "/**/style.{scss,sass}")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:"compressed"}) //expanded - развернутый css; compressed - минифициорованный
    .on("error", sass.logError))
    .on("error", notify.onError({
      message: "Error: <%= error.message %>",
      title: "Error running css"
    }))
    .pipe(postscc([
      autoprefixer()
    ]))
    .pipe(rename(function(path) {
      path.basename += ".min";
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream())
});

gulp.task("js", function() {
  return gulp.src(path.source.js + "/**/*.js")
    .pipe(sourcemaps.init())
    // .pipe(rollup({}, 'iife'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.min.js', { newLine : ' ; ' }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream())
})

gulp.task('otherJs', function() {
  return gulp.src(path.source.other + "/**/*.js")
  .pipe(concat('otherFull.min.js', { newLine : ' ; ' }))
  .pipe(uglify())
  .pipe(gulp.dest(path.build.other))
})

gulp.task('otherCss', function() {
  return gulp.src(path.source.other + "/**/*.css")
  .pipe(concat('otherFull.min.css'))
  .pipe(csso())
  .pipe(gulp.dest(path.build.other))
})

gulp.task('otherCopyAll', function() {
  return gulp.src(path.source.other + "/**/*.*")
  .pipe(flatten())
  .pipe(gulp.dest(path.build.other))
})

gulp.task("other", gulp.series("otherCss", "otherJs", "otherCopyAll"))

gulp.task("fonts", function() {
  return gulp.src(path.source.fonts + "/**/*.{woff,woff2}")
    .pipe(gulp.dest(path.build.fonts))
})

gulp.task("optim-img", function() {
  return gulp.src([
    path.source.img + "/**/*.{png,jpg,svg}",
    "!" + path.source.svgSprite + "/**"
  ])
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("webp", function() {
  return gulp.src(path.source.img + "/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest(path.build.img))
})

gulp.task("svg-sprite", function() {
  return gulp.src(path.source.svgSprite + "/*.svg")
  .pipe(imagemin([
    imagemin.svgo()
  ]))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest(path.build.img))
})

// gulp.task('plugins', function() {
//   return gulp.src(path.source.plugins + "/**/*")
//   .pipe(gulp.dest(path.build.plugins))
// })

gulp.task("server", function() {
  browserSync.init({
      server: {
          baseDir: path.build.dir
      },
      // notify: true,
      // tunnel: true,
      // host: "localhost",
      // port: 3000,
  });
  //  gulp.watch(path.source.plugins + "/**/*", gulp.series("plugins", "refresh"));
   gulp.watch(path.source.other + "/**/*", gulp.series("other", "refresh"));
   gulp.watch(path.source.html + "/*.html", gulp.series("html", "refresh"));
   gulp.watch(path.source.style + "/**/*.{scss,sass}", gulp.series("css"));
   gulp.watch(path.source.img + "/**/*.*", gulp.series("copy-img"));
   gulp.watch(path.source.js + "/**/*.js", gulp.series("js"));
   gulp.watch(path.source.svgSprite + "/*.svg", gulp.series("svg-sprite", "html", "refresh"));
   gulp.watch(path.source.fonts + "/**/*.{woff,woff2}", gulp.series("fonts", "refresh"));
});

gulp.task("build", gulp.series("clean", "copy", "css", "js", "other", /* "webp", */ "svg-sprite", "html"));
gulp.task("default", gulp.series("build", "server"));
