import express from "express";
import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";

import Maquina from "../models/Maquina.js";
import { proteger } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// =====================================================
// SUPABASE
// =====================================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = process.env.SUPABASE_BUCKET;


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
                    ? req.file.originalname
                    : "Sin archivo"
            );


            // =========================================
            // VALIDAR SUPABASE
            // =========================================

            if (
                !process.env.SUPABASE_URL ||
                !process.env.SUPABASE_SERVICE_ROLE_KEY ||
                !BUCKET
            ) {

                console.error(
                    "Faltan variables de Supabase"
                );

                return res.status(500).json({

                    mensaje:
                        "El servidor no tiene configurado Supabase"

                });

            }


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
            // VALIDAR DATOS
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

                console.log(
                    "Subiendo archivo a Supabase..."
                );


                // =====================================
                // CREAR NOMBRE ÚNICO
                // =====================================

                const extension =
                    req.file.originalname.includes(".")
                        ? "." +
                          req.file.originalname
                              .split(".")
                              .pop()
                              .toLowerCase()
                        : "";


                const nombreArchivo =
                    `maquinas/${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2, 10)}${extension}`;


                // =====================================
                // SUBIR A SUPABASE
                // =====================================

                const { error: errorSubida } =
                    await supabase.storage
                        .from(BUCKET)
                        .upload(
                            nombreArchivo,
                            req.file.buffer,
                            {
                                contentType:
                                    req.file.mimetype,

                                upsert: false
                            }
                        );


                if (errorSubida) {

                    console.error(
                        "ERROR SUBIENDO A SUPABASE:",
                        errorSubida
                    );

                    return res.status(500).json({

                        mensaje:
                            `No se pudo subir ${req.file.originalname}: ${errorSubida.message}`

                    });

                }


                console.log(
                    "Archivo subido correctamente:",
                    nombreArchivo
                );


                // =====================================
                // OBTENER URL PÚBLICA
                // =====================================

                const { data: urlData } =
                    supabase.storage
                        .from(BUCKET)
                        .getPublicUrl(
                            nombreArchivo
                        );


                const urlArchivo =
                    urlData.publicUrl;


                console.log(
                    "URL DEL ARCHIVO:",
                    urlArchivo
                );


                // =====================================
                // GUARDAR INFORMACIÓN
                // =====================================

                hojaVida = {

                    nombre:
                        req.file.originalname,

                    nombreServidor:
                        nombreArchivo,

                    ruta:
                        urlArchivo,

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
            // ELIMINAR ARCHIVO DE SUPABASE
            // =========================================

            if (
                maquina.hojaVida &&
                maquina.hojaVida.nombreServidor
            ) {

                const { error: errorEliminar } =
                    await supabase.storage
                        .from(BUCKET)
                        .remove([
                            maquina.hojaVida.nombreServidor
                        ]);


                if (errorEliminar) {

                    console.error(
                        "ERROR ELIMINANDO ARCHIVO DE SUPABASE:",
                        errorEliminar
                    );

                } else {

                    console.log(
                        "Archivo eliminado de Supabase:",
                        maquina.hojaVida.nombreServidor
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