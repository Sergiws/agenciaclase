import express from 'express';
import router from './routers/index.js';
import db from './config/db.js';

const app = express();

db.authenticate()
.then(() => console.log('Contectado a la base de datos'))
.catch(err => console.log(err));

const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    res.locals.nombreP = 'Agencia de Viajes';
    next();
});

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use("/", router);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});