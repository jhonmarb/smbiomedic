import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.routes.js";
import maquinaRoutes from "./routes/maquina.routes.js";
import mantenimientoRoutes from "./routes/mantenimiento.routes.js";
import intervencionRoutes from "./routes/intervencion.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

dotenv.config();

// ===============================
// COMPROBAR VARIABLES DE ENTORNO
// ===============================

const mongoUri = process.env.MONGO_URI?.trim();
const puerto = process.env.PORT || 4000;

console.log("MONGO_URI cargada:", !!mongoUri);
console.log(
    "MONGO_URI empieza correctamente:",
    mongoUri?.startsWith("mongodb+srv://")
);

if (mongoUri) {
    const usuarioMongo = mongoUri
        .replace("mongodb+srv://", "")
        .split(":")[0];

    console.log("Usuario Mongo:", usuarioMongo);
}

console.log("Puerto:", puerto);

// ===============================
// CREAR APLICACIÓN
// ===============================

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// CARPETA UPLOADS
// ===============================

const carpetaUploads = path.resolve("uploads");

if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads, { recursive: true });
}

app.use("/uploads", express.static(carpetaUploads));

// ===============================
// RUTAS
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/maquinas", maquinaRoutes);
app.use("/api/mantenimientos", mantenimientoRoutes);
app.use("/api/intervenciones", intervencionRoutes);
app.use("/api/usuarios", usuarioRoutes);

// ===============================
// RUTA PRINCIPAL
// ===============================

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de mantenimiento hospitalario funcionando"
    });
});

// ===============================
// CONEXIÓN MONGODB
// ===============================

if (!mongoUri) {
    console.error("ERROR: MONGO_URI no está configurada.");
    process.exit(1);
}

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("MongoDB conectado correctamente");

        app.listen(puerto, "0.0.0.0", () => {
            console.log(`Servidor funcionando en el puerto ${puerto}`);
        });
    })
    .catch((error) => {
        console.error("Error conectando MongoDB:", error);
    });