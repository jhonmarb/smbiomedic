import express from "express";
import path from "path";
import fs from "fs";

import Mantenimiento from "../models/Mantenimiento.js";

import { proteger } from "../middleware/auth.js";

import upload from "../middleware/upload.js";


const router = express.Router();


// ==================================================
// OBTENER MANTENIMIENTOS
// ==================================================

router.get(
    "/",
    proteger,

    async (req, res) => {

        try {

            const mantenimientos =
                await Mantenimiento.find()

                    .populate(
                        "maquina"
                    )

                    .populate(
                        "tecnico",
                        "nombre"
                    )

                    .sort({
                        fecha: -1
                    });


            res.json(
                mantenimientos
            );


        } catch (error) {

            console.error(
                "Error obteniendo mantenimientos:",
                error
            );


            res.status(500).json({

                mensaje:
                    "Error obteniendo los mantenimientos"

            });

        }

    }
);


// ==================================================
// CREAR MANTENIMIENTO
// ==================================================

router.post(
    "/",

    proteger,

    // =================================================
    // RECIBIR MÚLTIPLES ARCHIVOS
    // =================================================

    upload.array(
        "archivos",
        20
    ),

    async (req, res) => {

        try {

            console.log(
                "===================================="
            );

            console.log(
                "BODY RECIBIDO:",
                req.body
            );

            console.log(
                "ARCHIVOS RECIBIDOS:",
                req.files?.length || 0
            );

            console.log(
                "USUARIO:",
                req.usuario
            );

            console.log(
                "===================================="
            );


            // =========================================
            // VALIDAR MÁQUINA
            // =========================================

            if (!req.body.maquina) {

                return res.status(400).json({

                    mensaje:
                        "Debe seleccionar una máquina"

                });

            }


            // =========================================
            // VALIDAR FECHA
            // =========================================

            if (!req.body.fecha) {

                return res.status(400).json({

                    mensaje:
                        "Debe seleccionar una fecha"

                });

            }


            const fecha =
                new Date(
                    req.body.fecha
                );


            if (
                isNaN(
                    fecha.getTime()
                )
            ) {

                return res.status(400).json({

                    mensaje:
                        "La fecha del mantenimiento no es válida"

                });

            }


            // =========================================
            // OBTENER AÑO Y MES
            // =========================================

            const anio =
                fecha.getFullYear();


            const mes =
                fecha.getMonth() + 1;


            const mesCarpeta =
                String(
                    mes
                ).padStart(
                    2,
                    "0"
                );


            // =========================================
            // CREAR CARPETA FINAL
            // =========================================

            const carpetaMantenimiento =
                path.resolve(
                    "uploads",
                    "mantenimientos",
                    String(anio),
                    mesCarpeta,
                    req.body.maquina
                );


            fs.mkdirSync(
                carpetaMantenimiento,
                {
                    recursive: true
                }
            );


            // =========================================
            // MOVER ARCHIVOS TEMPORALES
            // =========================================

            const archivos = [];


            for (
                const file of (req.files || [])
            ) {

                const rutaFinal =
                    path.join(
                        carpetaMantenimiento,
                        file.filename
                    );


                fs.renameSync(
                    file.path,
                    rutaFinal
                );


                archivos.push({

                    nombre:
                        file.originalname,

                    ruta:
                        `/uploads/mantenimientos/${anio}/${mesCarpeta}/${req.body.maquina}/${file.filename}`,

                    tipo:
                        file.mimetype

                });

            }


            // =========================================
            // CREAR MANTENIMIENTO
            // =========================================

            const mantenimiento =
                await Mantenimiento.create({

                    maquina:
                        req.body.maquina,

                    fecha:
                        fecha,

                    anio:
                        anio,

                    mes:
                        mes,

                    tecnico:
                        req.usuario.id,

                    descripcion:
                        req.body.descripcion || "",

                    equiposAgregados:
                        req.body.equiposAgregados || "",

                    archivos:
                        archivos

                });


            // =========================================
            // RESPUESTA
            // =========================================

            res.status(201).json({

                mensaje:
                    "Mantenimiento guardado correctamente",

                mantenimiento

            });


        } catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "ERROR GUARDANDO MANTENIMIENTO:"
            );

            console.error(
                error
            );

            console.error(
                "===================================="
            );


            // =========================================
            // ELIMINAR ARCHIVOS TEMPORALES
            // =========================================

            if (req.files) {

                for (
                    const file of req.files
                ) {

                    try {

                        if (
                            fs.existsSync(
                                file.path
                            )
                        ) {

                            fs.unlinkSync(
                                file.path
                            );

                        }

                    } catch (errorArchivo) {

                        console.error(
                            "No se pudo eliminar archivo temporal:",
                            errorArchivo
                        );

                    }

                }

            }


            res.status(500).json({

                mensaje:
                    error.message ||
                    "Error guardando mantenimiento"

            });

        }

    }
);


export default router;