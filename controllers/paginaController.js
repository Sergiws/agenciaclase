import { where } from 'sequelize';
import {Viaje} from '../models/Viaje.js';
import {Testimonial} from '../models/Testimoniales.js';

const paginaInicio = async (req, res) => {

    const promiseDB = [];
    promiseDB.push(Viaje.findAll({limit:3}));
    promiseDB.push(Testimonial.findAll({limit:3, order:[["id","DESC"]]}));

    try{
        const resultado = await Promise.all(promiseDB);

        res.render('inicio', {
            pagina: "Inicio",
            clase: "home",
            viajes: resultado[0],
            testimonios: resultado[1]
        });
    } catch(err){
        console.log(err);
    }
}

const paginaNosotros = async (req, res) => {
    res.render('nosotros', {
        pagina: "nosotros"
    });
}

const paginaViajes = async (req, res) => {
    const viajes = await Viaje.findAll();

    res.render('viajes', {
        pagina: "Viajes Disponibles",
        viajes: viajes
    });
    
}

const paginaTestimonios = async (req, res) => {
    try{
        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["id","DESC"]]
        });

        res.render('testimonios', {
            pagina: "Testimonios",
            testimonios: testimonios
        });
    } catch(err){
        console.log(err);
    }
    
}

const paginaDetallesViajes = async (req, res) => {
    const {slug} = req.params;

    try{
        const resultado = await Viaje.findOne({where: {slug:slug}});
        res.render('viaje', {
            pagina: "Información del Viaje",
            resultado: resultado
        })
    } catch(error){
        console.log(error);
    }
}

const guardarTestimonios = async (req, res) => {
    const {nombre, correo, mensaje} = req.body;
    const errores = [];

    //Función para no tener código repetido
    const mostrarPagina = () => {
        let testimonios;
        try{
            testimonios = Testimonial.findAll({limit:6});
        } catch(err){
            errores.push({mensaje:`Error con la base de datos: ${err.toString()}`});
            testimonios = [];
        } finally{
            res.render('testimonios', {
                pagina: "Testimonios",
                errores: errores,
                nombre: nombre.trim(),
                correo: correo.trim(),
                mensaje: mensaje.trim(),
                testimonios: testimonios
            });
        }
    }

    if(nombre.trim() === ''){
        errores.push({mensaje: "El nombre está vacío"});
    }
    if(correo.trim() === ''){
        errores.push({mensaje: "El correo está vacío"});
    }
    if(mensaje.trim() === ''){
        errores.push({mensaje: "El mensaje está vacío"});
    }

    if(errores.length > 0){
        mostrarPagina();
    } else{
        try{
            await Testimonial.create({nombre:nombre, correoelectronico:correo, mensaje:mensaje});
            res.redirect('/testimonios');
        } catch(err){
            errores.push({mensaje:`Error con la base de datos: ${err.toString()}`});
        } finally{
            mostrarPagina();
        }
    }
}

export {
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimonios,
    paginaDetallesViajes,
    guardarTestimonios
}