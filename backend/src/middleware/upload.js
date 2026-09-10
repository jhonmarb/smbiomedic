import multer from "multer";
import path from "path";
import fs from "fs";


// ==================================================
// CARPETA TEMPORAL
// ==================================================

const carpetaTemporal = path.resolve(
    "uploads",
    "temp"
);


// Crear carpeta temporal si no existe

fs.mkdirSync(
    carpetaTemporal,
    {
        recursive: true
    }
);


// ==================================================
// CONFIGURACIÓN DE MULTER
// ==================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            carpetaTemporal
        );

    },


    filename: function (req, file, cb) {

        const nombre =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1E9
            ) +
            "-" +
            file.originalname.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


        cb(
            null,
            nombre
        );

    }

});


// ==================================================
// CONFIGURACIÓN FINAL
// ==================================================

const upload = multer({

    storage,

    limits: {

        // Máximo 20 MB por archivo
        fileSize:
            20 * 1024 * 1024

    }

});


export default upload;