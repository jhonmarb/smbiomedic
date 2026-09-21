import multer from "multer";

// ==================================================
// CONFIGURACIÓN DE MULTER
// ==================================================
//
// Los archivos NO se guardan en:
//
// uploads/temp
//
// Se mantienen temporalmente en memoria y después
// las rutas los suben directamente a Supabase Storage.
//
// ==================================================

const storage = multer.memoryStorage();

// ==================================================
// CONFIGURACIÓN FINAL
// ==================================================

const upload = multer({

    storage,

    limits: {

        // Máximo 20 MB por archivo
        fileSize:
            20 * 1024 * 1024,

        // Máximo 20 archivos por solicitud
        files:
            20

    }

});

export default upload;