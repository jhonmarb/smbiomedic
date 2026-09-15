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

// Comprobar que el archivo .env está siendo leído
console.log("MONGO_URI cargada:", !!process.env.MONGO_URI);

console.log(
    "Usuario Mongo:",
    process.env.MONGO_URI?.split("://")[1]?.split(":")[0]
);

const app = express();

app.use(cors());
app.use(express.json());

// Carpeta para archivos subidos
const carpetaUploads = path.resolve("uploads");

if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads, { recursive: true });
}

app.use("/uploads", express.static(carpetaUploads));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/maquinas", maquinaRoutes);
app.use("/api/mantenimientos", mantenimientoRoutes);
app.use("/api/intervenciones", intervencionRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de mantenimiento hospitalario funcionando"
    });
});

// Conexión con MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB conectado");

        app.listen(process.env.PORT, () => {
            console.log(
                `Servidor funcionando en http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("Error conectando MongoDB:", error);
    });