// npx gulp -> Y nombre de la funcion
// npm run -> Nombre del script en package.json

const { src, dest, watch, parallel } = require("gulp");

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber'); // Hace que al haber un error, se muestre de manera mas amigable,
                                         // y no corta la ejecucion del npm run dev
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');



// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


// Javascrip
const terser = require('gulp-terser-js');

function css(done) {
    // Localiza el archivo, lo compila y ejecuta en el primer pipe utilizanso SASS,
    // y luego ejecuta el segundo pipe, donde almacena la ejecucion
    // en la carpeta indicada

    src("src/scss/**/*.scss") // Identificar el archivo SASS // Con los "**/*" detecta los cambios de todos los archivos .scss
        .pipe(sourcemaps.init())
        .pipe(plumber())    
        .pipe(sass()) // Compilarlo, ejecutar sus funciones
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); // Almacenarla en el disco duro

    done(); // Callback que avisa a gulp que llegamos al final de la ejecucion
}


// Procesa imagenes JPG/PNG a un tamaño mucho mas ligero y las deja en el mismo formato.
function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    };

    src("src/img/**/*.{png,jpg}")
        .pipe(cache(imagemin(opciones)))
        .pipe(dest("build/img"));

    done();
}

// Procesa imagenes JPG/PNG a un tamaño mucho mas ligero y las deja en el formato Webp.
function versionWebp(done){
    const opciones = {
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")
        .pipe(webp(opciones))
        .pipe(dest("build/img"));

    done();
}

// Procesa imagenes JPG/PNG a un tamaño mucho mas ligero y las deja en el formato Avif.
function versionAvif(done){
    const opciones = {
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")
        .pipe(avif(opciones))
        .pipe(dest("build/img"));

    done();
}

function javascript(done) {
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/js"));
    done();
}



function dev(done) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
