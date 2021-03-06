//* Gulp moduls
const { src, series, parallel, watch, dest } = require("gulp");
//* Styles
const sass = require("gulp-sass");
const cssconcat = require("gulp-concat-css");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
//* HTML
const _fileinclude = require("gulp-file-include");
const htmlbeautify = require("gulp-html-beautify");
//* JS
const jsconcat = require("gulp-concat");
//* Server
const bs = require("browser-sync").create();
//* Files
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fs = require("fs");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-in-html");

//! Styles
/*
 * sass to css
 */
const sassScss = () => {
    return src("src/scss/*.scss")
        .pipe(
            sass({
                includePaths: ["src/scss"],
                errLogToConsole: true,
                outputStyle: "compressed",
            })
        )
        .pipe(
            autoprefixer({
                flex: true,
                grid: true,
                cascade: true,
            })
        )
        .pipe(dest("build/css"));
};
/*
 * concat and compress CSS libs
 */
const concatCSS = () => {
    return src(["src/css/*.css", "!src/css/style.css"])
        .pipe(cssconcat("bundle.css"))
        .pipe(
            autoprefixer({
                flex: true,
                grid: true,
                cascade: true,
            })
        )
        .pipe(cssnano())
        .pipe(dest("build/css"));
};
//! HTML
/*
 * include html files
 */
const fileinclude = () => {
    return src("src/pages/*.html")
        .pipe(
            _fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(
            htmlbeautify({
                indent_with_tabs: true,
                indent_size: 4,
            })
        )
        .pipe(dest("build"));
};
/*
 * add webp to html
 */
const addWebpToHtml = () => {
    return src(["build/*.html"]).pipe(webphtml()).pipe(dest("build"));
};
//! Call this task when you finish a project
exports.addWebpToHtml = addWebpToHtml;
//! DevServer
/*
 * devserver config
 */
const browsersync = () => {
    bs.init({
        server: {
            baseDir: "build/",
        },
        files: ["build/*.html", "build/**/*.js", "build/**/*.css"],
        notify: false,
        open: "local",
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false,
        },
    });
};
//! Fonts
/*
 * tasks for font: convert, add to file _fonts.scss, move to build folder
 */
const fontVals = {
    thin: 100,
    thinitalic: 100,
    light: 300,
    lightitalic: 300,
    regular: 400,
    regularitalic: 400,
    medium: 500,
    mediumitalic: 500,
    semibold: 600,
    semibolditalic: 600,
    bold: 700,
    bolditalic: 700,
    extrabold: 800,
    extrabolditalic: 800,
    black: 900,
    blackitalic: 900,
};
const fontWeight = (font) => {
    for (let item of Object.keys(fontVals)) {
        if (font.toLowerCase().includes(item)) {
            return fontVals[item];
        }
    }
};
const convertFonts = () => {
    src("src/fonts/*.ttf").pipe(ttf2woff()).pipe(dest("build/fonts/"));
    return src(["src/fonts/*.ttf"]).pipe(ttf2woff2()).pipe(dest("build/fonts/"));
};
const fontScss = "src/scss/_fonts.scss";
const fontsStyle = () => {
    let file_content = fs.readFileSync(fontScss);
    fs.readdir("src/fonts", function(err, items) {
        try {
            if (items) {
                let c_fontname;
                for (let i = 0; i < items.length; i++) {
                    let fontname = items[i].split(".");
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(`${fontScss}`, `@include font-face("${fontname}", "${fontname}", ${fontWeight(fontname)});\r\n`, () => {});
                    }
                    c_fontname = fontname;
                }
            }
        } catch (err) {
            throw err;
        }
    });
};

//! Images
const convertToWebp = () => {
    return src("src/img/**/*.{jpg,png}").pipe(webp()).pipe(dest("build/img"));
};
const compressImgs = () => {
    return src("src/img/**/*.{jpg,png,svg,webp,jpeg}")
        .pipe(cache(imagemin()))
        .pipe(dest("build/img"));
};
//! JS
const concatJSLibs = () => {
    return src("src/js/vendors/*.js")
        .pipe(jsconcat("bundle.js"))
        .pipe(dest("build/js/vendors"));
};

//! Watch
/*
 * task for files watching
 */
const startWatch = () => {
    watch("src/pages/**/*.html", fileinclude);
    watch("src/scss/**/*.scss", sassScss);
    watch("src/fonts/*.ttf", series(convertFonts, fontsStyle));
    watch("src/img/", series(convertToWebp, compressImgs));
    watch("src/js/libs/*.js", concatJSLibs);
    watch(["src/css/*.css", "!src/css/style.css"], concatCSS);
};

//? BUILD
exports.default = parallel(concatCSS, compressImgs, concatJSLibs, fileinclude, sassScss, browsersync, startWatch);