import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.js";

const router = express.Router();


// ======================================================
// REGISTRAR USUARIO
// POST /api/auth/registrar
// ======================================================

router.post("/registrar", async (req, res) => {

    try {

        const {
            nombre,
            usuario,
            password,
            rol
        } = req.body;

        // Validar datos
        if (!nombre || !usuario || !password) {

            return res.status(400).json({
                mensaje: "Nombre, usuario y contraseña son obligatorios"
            });

        }

        // Buscar si ya existe
        const usuarioExistente = await Usuario.findOne({
            usuario
        });

        if (usuarioExistente) {

            return res.status(400).json({
                mensaje: "El usuario ya existe"
            });

        }

        // Encriptar contraseña
        const passwordEncriptada = await bcrypt.hash(
            password,
            10
        );

        // Crear usuario
        const nuevoUsuario = await Usuario.create({

            nombre,

            usuario,

            password: passwordEncriptada,

            rol: rol || "consulta",

            activo: true

        });

        res.status(201).json({

            mensaje: "Usuario creado correctamente",

            usuario: {

                id: nuevoUsuario._id,

                nombre: nuevoUsuario.nombre,

                usuario: nuevoUsuario.usuario,

                rol: nuevoUsuario.rol

            }

        });

    } catch (error) {

        console.error("ERROR REGISTRANDO USUARIO:", error);

        res.status(500).json({

            mensaje: "Error creando usuario"

        });

    }

});


// ======================================================
// LOGIN
// POST /api/auth/login
// ======================================================

router.post("/login", async (req, res) => {

    try {

        console.log("=================================");
        console.log("LOGIN RECIBIDO");
        console.log("=================================");

        const {
            usuario,
            password
        } = req.body;


        // -----------------------------------------------
        // Validar datos
        // -----------------------------------------------

        if (!usuario || !password) {

            return res.status(400).json({

                mensaje: "Usuario y contraseña son obligatorios"

            });

        }


        console.log("Usuario recibido:", usuario);


        // -----------------------------------------------
        // Buscar usuario en MongoDB
        // -----------------------------------------------

        const usuarioEncontrado = await Usuario.findOne({

            usuario

        });


        console.log(
            "Usuario encontrado:",
            !!usuarioEncontrado
        );


        if (!usuarioEncontrado) {

            return res.status(401).json({

                mensaje: "Usuario o contraseña incorrectos"

            });

        }


        // -----------------------------------------------
        // Comprobar si está activo
        // -----------------------------------------------

        if (usuarioEncontrado.activo === false) {

            return res.status(403).json({

                mensaje: "El usuario está desactivado"

            });

        }


        // -----------------------------------------------
        // Comprobar contraseña
        // -----------------------------------------------

        const passwordCorrecta = await bcrypt.compare(

            password,

            usuarioEncontrado.password

        );


        console.log(
            "Contraseña correcta:",
            passwordCorrecta
        );


        if (!passwordCorrecta) {

            return res.status(401).json({

                mensaje: "Usuario o contraseña incorrectos"

            });

        }


        // -----------------------------------------------
        // Comprobar JWT_SECRET
        // -----------------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "ERROR: JWT_SECRET no está configurado en .env"
            );

            return res.status(500).json({

                mensaje: "El servidor no tiene configurada la clave JWT"

            });

        }


        // -----------------------------------------------
        // Crear token
        // -----------------------------------------------

        const token = jwt.sign(

            {

                id: usuarioEncontrado._id,

                usuario: usuarioEncontrado.usuario,

                rol: usuarioEncontrado.rol

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "8h"

            }

        );


        console.log("TOKEN CREADO");


        // -----------------------------------------------
        // Respuesta
        // -----------------------------------------------

        return res.status(200).json({

            mensaje: "Inicio de sesión correcto",

            token,

            usuario: {

                id: usuarioEncontrado._id,

                nombre: usuarioEncontrado.nombre,

                usuario: usuarioEncontrado.usuario,

                rol: usuarioEncontrado.rol

            }

        });


    } catch (error) {

        console.error(
            "ERROR LOGIN:",
            error
        );

        return res.status(500).json({

            mensaje: "Error iniciando sesión",

            error: error.message

        });

    }

});


// ======================================================
// EXPORTAR ROUTER
// ======================================================

export default router;