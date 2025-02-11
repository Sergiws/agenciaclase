import express from 'express';
import {paginaInicio, paginaNosotros, paginaViajes, paginaTestimonios,
        paginaDetallesViajes, guardarTestimonios}
        from '../controllers/paginaController.js';

const router = express.Router();

router.get("/", paginaInicio);

router.get("/nosotros", paginaNosotros);

router.get("/testimonios", paginaTestimonios);

router.get("/viajes", paginaViajes);

router.get("/viajes/:slug", paginaDetallesViajes);

router.post("/testimonios", guardarTestimonios);

export default router;