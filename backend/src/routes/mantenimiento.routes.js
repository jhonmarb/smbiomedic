import express from "express";

import { createClient } from "@supabase/supabase-js";

import Mantenimiento from "../models/Mantenimiento.js";

import { proteger } from "../middleware/auth.js";

import upload from "../middleware/upload.js";


const router = express.Router();


// ==================================================
// CONFIGURACIÓN DE SUPABASE
// ==================================================

const supabaseUrl =
    process.env.SUPABASE_URL?.trim();

const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const supabaseBucket =
    process.env.SUPABASE_BUCKET?.trim() ||
    "archivos";


if (
    !supabaseUrl ||
    !supabaseKey
) {

    console.error(
        "ERROR: Faltan las variables de Supabase."
    );

}


const supabase =
    supabaseUrl && supabaseKey
        ? createClient(
            supabaseUrl,
            supabaseKey
        )
        : null;


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

    upload.array(
        "archivos",
        20
    ),

    async (req, res) => {

        const archivosSubidos = [];


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
                "BUCKET SUPABASE:",
                supabaseBucket
            );

            console.log(
                "===================================="
            );


            // =========================================
            // COMPROBAR SUPABASE
            // =========================================

            if (!supabase) {

                return res.status(500).json({

                    mensaje:
                        "Supabase no está configurado correctamente"

                });

            }


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
            // SUBIR ARCHIVOS A SUPABASE
            // =========================================

            const archivos = [];


            for (
                const file of (
                    req.files || []
                )
            ) {

                // =====================================
                // NOMBRE SEGURO
                // =====================================

                const nombreSeguro =
                    file.originalname
                        .replace(
                            /[^a-zA-Z0-9._-]/g,
                            "_"
                        );


                // =====================================
                // NOMBRE ÚNICO
                // =====================================

                const nombreArchivo =
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() * 1E9
                    ) +
                    "-" +
                    nombreSeguro;


                // =====================================
                // RUTA DENTRO DE SUPABASE
                // =====================================

                const rutaSupabase =
                    `mantenimientos/${anio}/${mesCarpeta}/${req.body.maquina}/${nombreArchivo}`;


                console.log(
                    "Subiendo archivo:",
                    rutaSupabase
                );


                // =====================================
                // SUBIR ARCHIVO
                // =====================================

                const resultado =
                    await supabase
                        .storage
                        .from(
                            supabaseBucket
                        )
                        .upload(
                            rutaSupabase,
                            file.buffer,
                            {

                                contentType:
                                    file.mimetype,

                                upsert:
                                    false

                            }
                        );


                if (
                    resultado.error
                ) {

                    console.error(
                        "Error subiendo archivo a Supabase:",
                        resultado.error
                    );


                    throw new Error(
                        `No se pudo subir ${file.originalname}: ${resultado.error.message}`
                    );

                }


                // Guardamos la ruta para poder
                // eliminarla si MongoDB falla.

                archivosSubidos.push(
                    rutaSupabase
                );


                // =====================================
                // OBTENER URL PÚBLICA
                // =====================================

                const urlPublica =
                    supabase
                        .storage
                        .from(
                            supabaseBucket
                        )
                        .getPublicUrl(
                            rutaSupabase
                        );


                console.log(
                    "URL archivo:",
                    urlPublica.data.publicUrl
                );


                // =====================================
                // GUARDAR INFORMACIÓN
                // =====================================

                archivos.push({

                    nombre:
                        file.originalname,

                    ruta:
                        urlPublica
                            .data
                            .publicUrl,

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
            // ELIMINAR ARCHIVOS DE SUPABASE
            // SI FALLA MONGODB
            // =========================================

            if (
                supabase &&
                archivosSubidos.length > 0
            ) {

                try {

                    const resultadoEliminar =
                        await supabase
                            .storage
                            .from(
                                supabaseBucket
                            )
                            .remove(
                                archivosSubidos
                            );


                    if (
                        resultadoEliminar.error
                    ) {

                        console.error(
                            "No se pudieron eliminar archivos de Supabase:",
                            resultadoEliminar.error
                        );

                    }

                } catch (
                    errorEliminar
                ) {

                    console.error(
                        "Error eliminando archivos de Supabase:",
                        errorEliminar
                    );

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