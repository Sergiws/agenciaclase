import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Admin = db.define('admin', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});