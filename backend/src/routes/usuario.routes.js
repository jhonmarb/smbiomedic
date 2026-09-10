import express from "express";
import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// =====================================================
// OBTENER TODOS LOS USUARIOS
// EXCEPTO EL ADMINISTRADOR PRINCIPAL "admin"
// =====================================================

router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuario.find({
            usuario: {
                $ne: "admin"
            }
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(usuarios);

    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        res.status(500).json({
            mensaje: "Error al obtener los usuarios"
        });
    }
});


// =====================================================
// OBTENER UN USUARIO POR ID
// =====================================================

router.get("/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findById(
            req.params.id
        ).select("-password");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.json(usuario);

    } catch (error) {
        console.error("Error al obtener usuario:", error);

        res.status(500).json({
            mensaje: "Error al obtener el usuario"
        });
    }
});


// =====================================================
// CREAR USUARIO
// =====================================================

router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            usuario,
            password,
            rol
        } = req.body;

        if (!nombre || !usuario || !password) {
            return res.status(400).json({
                mensaje:
                    "Nombre, usuario y contraseña son obligatorios"
            });
        }

        const usuarioExiste = await Usuario.findOne({
            usuario: usuario.trim()
        });

        if (usuarioExiste) {
            return res.status(400).json({
                mensaje:
                    "El nombre de usuario ya existe"
            });
        }

        const passwordEncriptada =
            await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre: nombre.trim(),
            usuario: usuario.trim(),
            password: passwordEncriptada,
            rol: rol || "consulta",
            activo: true
        });

        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: "Usuario creado correctamente",

            usuario: {
                _id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                usuario: nuevoUsuario.usuario,
                rol: nuevoUsuario.rol,
                activo: nuevoUsuario.activo,
                createdAt: nuevoUsuario.createdAt
            }
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                mensaje:
                    "El nombre de usuario ya existe"
            });
        }

        res.status(500).json({
            mensaje: "Error al crear el usuario"
        });
    }
});


// =====================================================
// EDITAR USUARIO
// =====================================================

router.put("/:id", async (req, res) => {
    try {
        const {
            nombre,
            usuario,
            password,
            rol,
            activo
        } = req.body;

        const usuarioExistente =
            await Usuario.findById(req.params.id);

        if (!usuarioExistente) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        // No permitir editar la cuenta principal
        if (usuarioExistente.usuario === "admin") {
            return res.status(403).json({
                mensaje:
                    "La cuenta principal de administrador no puede modificarse desde aquí"
            });
        }

        // Verificar usuario repetido
        if (
            usuario &&
            usuario.trim() !==
                usuarioExistente.usuario
        ) {
            const usuarioRepetido =
                await Usuario.findOne({
                    usuario: usuario.trim(),
                    _id: {
                        $ne: req.params.id
                    }
                });

            if (usuarioRepetido) {
                return res.status(400).json({
                    mensaje:
                        "Ese nombre de usuario ya existe"
                });
            }

            usuarioExistente.usuario =
                usuario.trim();
        }

        if (nombre) {
            usuarioExistente.nombre =
                nombre.trim();
        }

        if (rol) {
            usuarioExistente.rol = rol;
        }

        if (typeof activo === "boolean") {
            usuarioExistente.activo = activo;
        }

        if (
            password &&
            password.trim() !== ""
        ) {
            usuarioExistente.password =
                await bcrypt.hash(
                    password,
                    10
                );
        }

        await usuarioExistente.save();

        res.json({
            mensaje:
                "Usuario actualizado correctamente",

            usuario: {
                _id: usuarioExistente._id,
                nombre: usuarioExistente.nombre,
                usuario: usuarioExistente.usuario,
                rol: usuarioExistente.rol,
                activo: usuarioExistente.activo,
                createdAt:
                    usuarioExistente.createdAt,
                updatedAt:
                    usuarioExistente.updatedAt
            }
        });

    } catch (error) {
        console.error(
            "Error al actualizar usuario:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar el usuario"
        });
    }
});


// =====================================================
// ACTIVAR / DESACTIVAR USUARIO
// =====================================================

router.patch("/:id/estado", async (req, res) => {
    try {
        const { activo } = req.body;

        const usuario =
            await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        // No permitir modificar el admin principal
        if (usuario.usuario === "admin") {
            return res.status(403).json({
                mensaje:
                    "No puedes desactivar el administrador principal"
            });
        }

        usuario.activo = activo;

        await usuario.save();

        res.json({
            mensaje: activo
                ? "Usuario activado correctamente"
                : "Usuario desactivado correctamente",

            usuario: {
                _id: usuario._id,
                nombre: usuario.nombre,
                usuario: usuario.usuario,
                rol: usuario.rol,
                activo: usuario.activo
            }
        });

    } catch (error) {
        console.error(
            "Error al cambiar estado:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al cambiar el estado del usuario"
        });
    }
});


// =====================================================
// ELIMINAR USUARIO
// =====================================================

router.delete("/:id", async (req, res) => {
    try {
        const usuario =
            await Usuario.findById(
                req.params.id
            );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "Usuario no encontrado"
            });
        }

        // No permitir eliminar el admin principal
        if (usuario.usuario === "admin") {
            return res.status(403).json({
                mensaje:
                    "No puedes eliminar el administrador principal"
            });
        }

        await Usuario.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensaje:
                "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error(
            "Error al eliminar usuario:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar el usuario"
        });
    }
});


export default router;