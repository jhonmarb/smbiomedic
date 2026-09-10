import mongoose from "mongoose";


const archivoSchema = new mongoose.Schema({

    nombre: String,

    nombreServidor: String,

    ruta: String,

    tipo: String

});


const maquinaSchema = new mongoose.Schema(
    {

        nombre: {
            type: String,
            required: true
        },

        areaSoporte: {
            type: String,
            required: true
        },

        hojaVida: {
            type: archivoSchema,
            default: null
        }

    },
    {
        timestamps: true
    }
);


const Maquina = mongoose.model(
    "Maquina",
    maquinaSchema
);


export default Maquina;