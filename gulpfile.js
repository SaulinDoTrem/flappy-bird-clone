const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

function styles() {
  return src("src/styles/main.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(dest("dist"));
}

function sentinel() {
  watch("src/styles/*.scss", { ignoreInitial: false }, styles);
}

exports.sentinel = sentinel;
