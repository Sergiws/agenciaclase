import db from '../config/db.js';
import { where } from 'sequelize';
import { Viaje } from '../models/Viaje.js';
import { Testimonial } from '../models/Testimoniales.js';
import { Admin } from '../models/Admin.js';
import {Imagen} from '../models/Imagenes.js';
import path from 'path';
import fs from 'fs';

//-------------------------------- INICIO ---------------------------------
const paginaInicio = async (req, res) => {

    const promiseDB = [];
    promiseDB.push(Viaje.findAll({ limit: 3 }));
    promiseDB.push(Testimonial.findAll({ limit: 3, order: [["id", "DESC"]] }));

    try {
        const resultado = await Promise.all(promiseDB);

        res.render('inicio', {
            pagina: "Inicio",
            clase: "home",
            viajes: resultado[0],
            testimonios: resultado[1]
        });
    } catch (err) {
        res.render('error', {
            pagina: "Error",
            error: err
        });
    }
}

//-------------------------------- NOSOTROS ---------------------------------
const paginaNosotros = (req, res) => {
    res.render('nosotros', {
        pagina: "nosotros"
    });
}

//-------------------------------- VIAJES ---------------------------------
const paginaViajes = async (req, res) => {

    try {
        const viajes = await Viaje.findAll();
        res.render('viajes', {
            pagina: "Viajes Disponibles",
            viajes: viajes
        });
    } catch (err) {
        res.render('error', {
            pagina: "Error",
            error: err
        });
    }

}

const paginaDetallesViajes = async (req, res) => {
    const { slug } = req.params;

    try {
        const resultado = await Viaje.findOne({ where: { slug: slug } });
        res.render('viaje', {
            pagina: "Información del Viaje",
            resultado: resultado
        })
    } catch (err) {
        res.render('error', {
            pagina: "Error",
            error: err
        });
    }
}

//-------------------------------- TESTIMONIOS ---------------------------------
const paginaTestimonios = async (req, res) => {
    try {
        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["id", "DESC"]]
        });

        res.render('testimonios', {
            pagina: "Testimonios",
            testimonios: testimonios
        });
    } catch (err) {
        res.render('error', {
            pagina: "Error",
            error: err
        });
    }

}

const guardarTestimonios = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    const errores = [];

    //Función para no tener código repetido
    const mostrarPagina = () => {
        let testimonios;
        try {
            testimonios = Testimonial.findAll({ limit: 6 });
        } catch (err) {
            errores.push({ mensaje: `Error con la base de datos: ${err.toString()}` });
            testimonios = [];
        } finally {
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

    if (nombre.trim() === '') {
        errores.push({ mensaje: "El nombre está vacío" });
    }
    if (correo.trim() === '') {
        errores.push({ mensaje: "El correo está vacío" });
    }
    if (mensaje.trim() === '') {
        errores.push({ mensaje: "El mensaje está vacío" });
    }

    if (errores.length > 0) {
        mostrarPagina();
    } else {
        try {
            await Testimonial.create({ nombre: nombre, correoelectronico: correo, mensaje: mensaje });
            res.redirect('/testimonios');
        } catch (err) {
            errores.push({ mensaje: `Error con la base de datos: ${err.toString()}` });
        } finally {
            mostrarPagina();
        }
    }
}

//-------------------------------- ADMINISTRADORES ---------------------------------
const verificarAdmin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/login");
    }
}

const paginaLogin = (req, res) => {
    res.render('login', {
        pagina: "Login"
    });
}

const acceder = async (req, res) => {
    const { correo, password } = req.body;
    const errores = [];

    const recargarPagina = () => {
        res.render('login', {
            pagina: "Login",
            correo: correo.trim(),
            errores: errores
        });
    }

    if (correo.trim() === '') {
        errores.push({ mensaje: "El correo está vacío" });
    }
    if (password.trim() === '') {
        errores.push({ mensaje: "La contraseña está vacía" });
    }

    try {
        const admin = await Admin.findAll({
            where: {
                email: correo,
                password: password
            }
        });

        if (admin.length > 0) {
            req.session.admin = correo;
            res.redirect('/admin');
        } else {
            errores.push({ mensaje: "Correo o contraseña incorrectos" });
            recargarPagina();
        }

    } catch (err) {
        errores.push({ mensaje: `Error con la base de datos: ${err.toString()}` });
        recargarPagina();
    }
}

const paginaAdmin = (req, res) => {
    res.render('admin', {
        pagina: "Admin"
    });
}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

const paginaCrearViaje = async (req, res) => {
    try {
        const resultados = await Imagen.findAll();

        res.render('crear_viaje', {
            pagina: "Crear Viaje",
            resultados: resultados
        });

    } catch (err) {
        res.render('error', {
            pagina: "Error",
            error: err
        });
    }

}

const crearViaje = async (req, res) => {
    console.log(req.body);
    const {titulo, precio, fecha_ida, fecha_vuelta, descripcion, disponibles, slug, imagen} = req.body;
    const resultados = await Imagen.findAll();
    const errores = [];

    try {
        await Viaje.create({titulo:titulo, precio:precio, fecha_ida:fecha_ida, fecha_vuelta:fecha_vuelta,
            descripcion:descripcion, disponibles: disponibles, slug:slug, imagen:imagen});

        res.render('crear_viaje', {
            confirmacion: "Viaje creado correctamente",
            resultados: resultados
        });
        
    } catch (err) {
        errores.push({ mensaje: `Error con la base de datos: ${err.toString()}` });
        res.render('crear_viaje', {
            errores: errores,
            resultados: resultados
        });
    }
}

const paginaSubirImagen = (req, res) => {
    res.render('subir_imagen', {
        pagina: "Subir Imagen"
    })
}

const subirImagen = async (req, res) => {
    const errores = [];
    const imagenes = await Imagen.findAll();

    try {
        const nombreImagen = req.body.nombre;

        imagenes.forEach(imagen => {
            if(nombreImagen == imagen.nombre){
                errores.push('El nombre de la imagen ya existe. Escoja otro');
                throw 'Nombre inválido';
            }
        });

        if (!nombreImagen) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        if (!req.files || !req.files.imagen || !req.files.imagen_ln) {
            return res.status(400).json({ error: 'Ambas imágenes son requeridas' });
        }

        // Guardar manualmente los archivos en `public/img/`
        const saveFile = (fileBuffer, filename) => {
            const filePath = path.join('public/img/', filename);
            fs.writeFileSync(filePath, fileBuffer);
        };

        saveFile(req.files.imagen[0].buffer, `destinos_${nombreImagen}.jpg`);
        saveFile(req.files.imagen_ln[0].buffer, `destinos_${nombreImagen}_ln.jpg`);

        await Imagen.create({nombre:nombreImagen});

        res.render('subir_imagen', {
            confirmacion: "Las imágenes se han subido correctamente"
        });
    } catch (error) {
        errores.push(error);
        res.render('subir_imagen', {
            errores: errores
        })
    }
}

export {
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimonios,
    paginaDetallesViajes,
    guardarTestimonios,
    verificarAdmin,
    paginaLogin,
    acceder,
    paginaAdmin,
    logout,
    paginaCrearViaje,
    crearViaje,
    paginaSubirImagen,
    subirImagen
}