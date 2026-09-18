import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import maquinaRoutes from "./routes/maquina.routes.js";
import mantenimientoRoutes from "./routes/mantenimiento.routes.js";
import intervencionRoutes from "./routes/intervencion.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

dotenv.config();

// ==================================================
// CONFIGURACIÓN DE RUTAS
// ==================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================================================
// VARIABLES DE ENTORNO
// ==================================================

const mongoUri = process.env.MONGO_URI?.trim();
const puerto = process.env.PORT || 4000;

// ==================================================
// CARPETA DE ARCHIVOS
// ==================================================
//
// En Render vamos a utilizar:
//
// /opt/render/project/src/uploads
//
// Si el proyecto está en otra ubicación, __dirname
// permite que la aplicación encuentre uploads
// correctamente.
//
// ==================================================

const carpetaUploads = path.join(
    __dirname,
    "uploads"
);

const carpetaTemp = path.join(
    carpetaUploads,
    "temp"
);

// Crear carpetas si no existen

fs.mkdirSync(
    carpetaUploads,
    {
        recursive: true
    }
);

fs.mkdirSync(
    carpetaTemp,
    {
        recursive: true
    }
);

// ==================================================
// INFORMACIÓN DE INICIO
// ==================================================

console.log(
    "===================================="
);

console.log(
    "INICIANDO SERVIDOR"
);

console.log(
    "===================================="
);

console.log(
    "MONGO_URI cargada:",
    !!mongoUri
);

console.log(
    "MONGO_URI empieza correctamente:",
    mongoUri?.startsWith("mongodb+srv://")
);

console.log(
    "Carpeta uploads:",
    carpetaUploads
);

console.log(
    "Carpeta temporal:",
    carpetaTemp
);

console.log(
    "Puerto:",
    puerto
);

if (mongoUri) {

    const usuarioMongo =
        mongoUri
            .replace("mongodb+srv://", "")
            .split(":")[0];

    console.log(
        "Usuario Mongo:",
        usuarioMongo
    );
}

// ==================================================
// CREAR APLICACIÓN
// ==================================================

const app = express();

// ==================================================
// MIDDLEWARES
// ==================================================

app.use(
    cors()
);

app.use(
    express.json()
);

// ==================================================
// ARCHIVOS ESTÁTICOS
// ==================================================
//
// Esto permite acceder públicamente a:
//
// https://smbiomedic.onrender.com/uploads/...
//
// ==================================================

app.use(
    "/uploads",
    express.static(
        carpetaUploads,
        {
            fallthrough: false,
            index: false
        }
    )
);

// ==================================================
// RUTAS API
// ==================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/maquinas",
    maquinaRoutes
);

app.use(
    "/api/mantenimientos",
    mantenimientoRoutes
);

app.use(
    "/api/intervenciones",
    intervencionRoutes
);

app.use(
    "/api/usuarios",
    usuarioRoutes
);

// ==================================================
// RUTA PRINCIPAL
// ==================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            mensaje:
                "API de mantenimiento hospitalario funcionando",

            uploads:
                "/uploads",

            estado:
                "OK"

        });

    }
);

// ==================================================
// RUTA PARA COMPROBAR UPLOADS
// ==================================================

app.get(
    "/api/estado-uploads",
    (req, res) => {

        try {

            const existe =
                fs.existsSync(
                    carpetaUploads
                );

            res.json({

                carpetaUploads,

                existe,

                mensaje:
                    existe
                        ? "Carpeta uploads disponible"
                        : "Carpeta uploads no encontrada"

            });

        } catch (error) {

            res.status(500).json({

                mensaje:
                    "Error comprobando carpeta uploads",

                error:
                    error.message

            });

        }

    }
);

// ==================================================
// CONEXIÓN MONGODB
// ==================================================

if (!mongoUri) {

    console.error(
        "ERROR: MONGO_URI no está configurada."
    );

    process.exit(1);

}

mongoose
    .connect(
        mongoUri
    )
    .then(() => {

        console.log(
            "MongoDB conectado correctamente"
        );

        app.listen(
            puerto,
            "0.0.0.0",
            () => {

                console.log(
                    `Servidor funcionando en el puerto ${puerto}`
                );

                console.log(
                    `Uploads disponibles en: /uploads`
                );

            }
        );

    })
    .catch(
        (error) => {

            console.error(
                "Error conectando MongoDB:",
                error
            );

            process.exit(1);

        }
    );