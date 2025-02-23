import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Imagen = db.define('imagenes', {
    nombre: {
        type: Sequelize.STRING
    }
});