import express from 'express';
import session from 'express-session';
import router from './routers/index.js';
import db from './config/db.js';

const app = express();

app.use(express.urlencoded({extended: true}));

//Middleware de sesión
app.use(
    session({
        secret: process.env.SESSION_SECRET, //Para firmar la cookie de sesión
        resave: false, //No se vuelve a guardar la sesión si no hay cambios
        saveUninitialized: false, //No guardar sesiones vacías
        cookie: {secure: false} //false porque utilizamos HTTP (true con HTTPS)
    })
);

db.authenticate()
.then(() => console.log('Contectado a la base de datos'))
.catch(err => console.log(err));

const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    res.locals.nombreP = 'Agencia de Viajes';
    res.locals.session = req.session;
    next();
});

app.use(express.static('public'));

app.use("/", router);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});