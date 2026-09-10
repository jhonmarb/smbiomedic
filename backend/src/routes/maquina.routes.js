import express from "express";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

import Maquina from "../models/Maquina.js";
import { proteger } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// =====================================================
// CARPETA DE ARCHIVOS DE MÁQUINAS
// =====================================================

const carpetaMaquinas = path.resolve(
    "uploads",
    "maquinas"
);


// Crear carpeta si no existe

fs.mkdirSync(
    carpetaMaquinas,
    {
        recursive: true
    }
);


// =====================================================
// ELIMINAR ÍNDICE ANTIGUO DE CODIGO
// =====================================================

let indiceCodigoRevisado = false;


// =====================================================
// OBTENER TODAS LAS MÁQUINAS
// =====================================================

router.get(
    "/",
    proteger,

    async (req, res) => {

        try {

            const maquinas =
                await Maquina.find({})
                    .sort({
                        nombre: 1
                    });

            return res.status(200).json(
                maquinas
            );

        } catch (error) {

            console.error(
                "ERROR OBTENIENDO MÁQUINAS:",
                error
            );

            return res.status(500).json({

                mensaje:
                    error.message ||
                    "Error obteniendo las máquinas"

            });

        }

    }
);


// =====================================================
// CREAR MÁQUINA
// SOLO ADMIN
// =====================================================

router.post(
    "/",
    proteger,

    (req, res, next) => {

        if (
            !req.usuario ||
            req.usuario.rol !== "admin"
        ) {

            return res.status(403).json({

                mensaje:
                    "Solo el administrador puede agregar máquinas"

            });

        }

        req.tipoArchivo = "maquina";

        next();

    },

    upload.single("hojaVida"),

    async (req, res) => {

        try {

            console.log(
                "===================================="
            );

            console.log(
                "CREANDO MÁQUINA"
            );

            console.log(
                "BODY:",
                req.body
            );

            console.log(
                "ARCHIVO:",
                req.file
            );


            // =========================================
            // ELIMINAR ÍNDICE ANTIGUO
            // =========================================

            if (!indiceCodigoRevisado) {

                try {

                    await Maquina.collection.dropIndex(
                        "codigo_1"
                    );

                    console.log(
                        "Índice antiguo codigo_1 eliminado correctamente"
                    );

                } catch (errorIndice) {

                    console.log(
                        "El índice codigo_1 no existe o ya fue eliminado"
                    );

                }

                indiceCodigoRevisado = true;

            }


            // =========================================
            // DATOS
            // =========================================

            const nombre =
                req.body.nombre
                    ? req.body.nombre.trim()
                    : "";


            const areaSoporte =
                req.body.areaSoporte
                    ? req.body.areaSoporte.trim()
                    : "";


            // =========================================
            // VALIDAR
            // =========================================

            if (!nombre) {

                return res.status(400).json({

                    mensaje:
                        "El nombre de la máquina es obligatorio"

                });

            }


            if (!areaSoporte) {

                return res.status(400).json({

                    mensaje:
                        "El área de soporte es obligatoria"

                });

            }


            // =========================================
            // HOJA DE VIDA
            // =========================================

            let hojaVida = null;


            if (req.file) {

                // =====================================
                // RUTA TEMPORAL
                // =====================================

                const archivoTemporal =
                    req.file.path;


                // =====================================
                // RUTA FINAL
                // =====================================

                const archivoFinal =
                    path.join(
                        carpetaMaquinas,
                        req.file.filename
                    );


                // =====================================
                // MOVER ARCHIVO
                // =====================================

                fs.renameSync(
                    archivoTemporal,
                    archivoFinal
                );


                console.log(
                    "ARCHIVO MOVIDO A:",
                    archivoFinal
                );


                // =====================================
                // GUARDAR INFORMACIÓN
                // =====================================

                hojaVida = {

                    nombre:
                        req.file.originalname,

                    nombreServidor:
                        req.file.filename,

                    ruta:
                        `/uploads/maquinas/${req.file.filename}`,

                    tipo:
                        req.file.mimetype

                };

            }


            // =========================================
            // CREAR MÁQUINA
            // =========================================

            const maquina =
                await Maquina.create({

                    nombre:
                        nombre,

                    areaSoporte:
                        areaSoporte,

                    hojaVida:
                        hojaVida

                });


            console.log(
                "MÁQUINA CREADA:",
                maquina._id
            );


            // =========================================
            // RESPUESTA
            // =========================================

            return res.status(201).json({

                mensaje:
                    "Máquina agregada correctamente",

                maquina

            });


        } catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "ERROR CREANDO MÁQUINA:"
            );

            console.error(
                error
            );

            console.error(
                "===================================="
            );


            return res.status(500).json({

                mensaje:
                    error.message ||
                    "Error agregando máquina"

            });

        }

    }
);


// =====================================================
// ELIMINAR MÁQUINA
// SOLO ADMIN
// =====================================================

router.delete(
    "/:id",
    proteger,

    async (req, res) => {

        try {

            if (
                !req.usuario ||
                req.usuario.rol !== "admin"
            ) {

                return res.status(403).json({

                    mensaje:
                        "Solo el administrador puede eliminar máquinas"

                });

            }


            const maquina =
                await Maquina.findById(
                    req.params.id
                );


            if (!maquina) {

                return res.status(404).json({

                    mensaje:
                        "Máquina no encontrada"

                });

            }


            // =========================================
            // ELIMINAR ARCHIVO FÍSICO
            // =========================================

            if (
                maquina.hojaVida &&
                maquina.hojaVida.nombreServidor
            ) {

                const archivo =
                    path.join(
                        carpetaMaquinas,
                        maquina.hojaVida.nombreServidor
                    );


                if (fs.existsSync(archivo)) {

                    fs.unlinkSync(archivo);

                    console.log(
                        "Archivo eliminado:",
                        archivo
                    );

                }

            }


            // =========================================
            // ELIMINAR MÁQUINA
            // =========================================

            await Maquina.findByIdAndDelete(
                req.params.id
            );


            return res.json({

                mensaje:
                    "Máquina eliminada correctamente"

            });


        } catch (error) {

            console.error(
                "ERROR ELIMINANDO MÁQUINA:",
                error
            );


            return res.status(500).json({

                mensaje:
                    error.message ||
                    "Error eliminando máquina"

            });

        }

    }
);


export default router;