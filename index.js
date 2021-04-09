require('dotenv').config();
const {dbConnection} = require('./database/config')
const express = require('express')


var cors = require('cors')


//Crear servidor de express
const app = express();

//Configurar CORS
app.use(cors())

//Base de Datos 
dbConnection();

//VER Variables de entorno
//console.log(process.env);

//rutas
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
})

app.get('/error', (req, res) => {

    res.status(400).json({
        ok: false,
        msg: 'Error 400'
    })
})

//estableciendo puerto de escucha
app.listen(process.env.PORT, () =>{
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
})