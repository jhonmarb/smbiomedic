import mongoose from "mongoose";

const intervencionSchema = new mongoose.Schema(
    {
        maquina: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Maquina",
            required: true
        },

        fecha: {
            type: Date,
            required: true
        },

        anio: {
            type: Number,
            required: true
        },

        mes: {
            type: Number,
            required: true
        },

        tecnico: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true
        },

        descripcion: {
            type: String,
            default: ""
        },

        equiposAgregados: {
            type: String,
            default: ""
        },

        archivos: [
            {
                nombre: {
                    type: String,
                    required: true
                },

                ruta: {
                    type: String,
                    required: true
                },

                tipo: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Intervencion = mongoose.model(
    "Intervencion",
    intervencionSchema
);

export default Intervencion;