import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ==================================================
// CONFIGURACIÓN DE RUTA
// ==================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================================================
// CARPETA RAÍZ DEL PROYECTO
// ==================================================
//
// middleware/
//     upload.js
//
// ../
//     uploads/
//

const carpetaProyecto =
    path.resolve(
        __dirname,
        ".."
    );

// ==================================================
// CARPETA TEMPORAL
// ==================================================

const carpetaTemporal =
    path.join(
        carpetaProyecto,
        "uploads",
        "temp"
    );

// ==================================================
// CREAR CARPETA TEMPORAL
// ==================================================

fs.mkdirSync(
    carpetaTemporal,
    {
        recursive: true
    }
);

console.log(
    "Carpeta temporal de Multer:",
    carpetaTemporal
);

// ==================================================
// CONFIGURACIÓN DE MULTER
// ==================================================

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                carpetaTemporal
            );

        },

        filename: function (
            req,
            file,
            cb
        ) {

            const nombreSeguro =
                file.originalname
                    .replace(
                        /[^a-zA-Z0-9._-]/g,
                        "_"
                    );

            const nombreFinal =
                Date.now() +
                "-" +
                Math.round(
                    Math.random() * 1E9
                ) +
                "-" +
                nombreSeguro;

            cb(
                null,
                nombreFinal
            );

        }

    });

// ==================================================
// CONFIGURACIÓN FINAL
// ==================================================

const upload =
    multer({

        storage,

        limits: {

            // Máximo 20 MB por archivo

            fileSize:
                20 * 1024 * 1024

        }

    });

export default upload;