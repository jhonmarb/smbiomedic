import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        usuario: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        rol: {
            type: String,
            enum: [
                "admin",
                "tecnico",
                "consulta"
            ],
            default: "consulta"
        },

        activo: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

export default mongoose.model(
    "Usuario",
    usuarioSchema
);