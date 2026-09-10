import jwt from "jsonwebtoken";

export function proteger(req, res, next) {

    const encabezado = req.headers.authorization;


    // ==========================================
    // VERIFICAR QUE EXISTA EL HEADER
    // ==========================================

    if (!encabezado) {

        return res.status(401).json({
            mensaje: "No autorizado. Falta el token."
        });

    }


    // ==========================================
    // VERIFICAR FORMATO
    // ==========================================

    if (!encabezado.startsWith("Bearer ")) {

        return res.status(401).json({
            mensaje: "Formato de token inválido."
        });

    }


    const token =
        encabezado.split(" ")[1];


    if (!token) {

        return res.status(401).json({
            mensaje: "Token no proporcionado."
        });

    }


    // ==========================================
    // VERIFICAR JWT_SECRET
    // ==========================================

    if (!process.env.JWT_SECRET) {

        console.error(
            "ERROR: JWT_SECRET no está configurado en .env"
        );

        return res.status(500).json({
            mensaje:
                "El servidor no tiene configurada la clave JWT"
        });

    }


    // ==========================================
    // VERIFICAR TOKEN
    // ==========================================

    try {

        const usuario =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Guardamos la información del usuario

        req.usuario = usuario;


        console.log(
            "Usuario autenticado:",
            usuario.usuario,
            "| Rol:",
            usuario.rol
        );


        next();

    } catch (error) {

        console.error(
            "Error verificando JWT:",
            error.message
        );


        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });

    }

}