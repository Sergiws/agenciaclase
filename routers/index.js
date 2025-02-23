import express from 'express';
import {
        paginaInicio, paginaNosotros, paginaViajes, paginaTestimonios,
        paginaDetallesViajes, guardarTestimonios, acceder,
        verificarAdmin, paginaLogin, paginaAdmin, logout, paginaCrearViaje,
        crearViaje, paginaSubirImagen, subirImagen
}
        from '../controllers/paginaController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = 'public/img/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Usamos `memoryStorage` para capturar el archivo sin guardarlo todavía
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg') {
            return cb(new Error('Solo se permiten imágenes JPG'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2MB por archivo
});

router.get("/", paginaInicio);

router.get("/nosotros", paginaNosotros);

router.get("/testimonios", paginaTestimonios);

router.get("/viajes", paginaViajes);

router.get("/viajes/:slug", paginaDetallesViajes);

router.post("/testimonios", guardarTestimonios);

router.get("/login", paginaLogin);

router.post("/login", acceder);

router.get("/admin", verificarAdmin, paginaAdmin);

router.get("/logout", logout);

router.get('/crear_viaje', verificarAdmin, paginaCrearViaje);

router.post('/crear_viaje', crearViaje);

router.get('/subir_imagen', verificarAdmin, paginaSubirImagen);

router.post('/subir_imagen', upload.fields([{ name: 'imagen' }, { name: 'imagen_ln' }]), subirImagen);

// router.get('/error', (req, res) => {
//         res.render('error', {
//                 pagina: "Error",
//                 error: "No se pudo conectar a la base de datos"
//         });
// });

// import db from '../config/db.js';
// router.get('/prueba', async (req, res) => {
//         try{
//                 const [resultados, metadata] = await db.query('SELECT DISTINCT imagen FROM viajes');
//                 resultados.forEach(resultado => {
//                         console.log(resultado.imagen);
//                 });
//                 res.send(resultados);
//         } catch(err){
//                 res.send(`Ha habido un error: ${err}`);
//         }
// });

export default router;