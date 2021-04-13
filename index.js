require('dotenv').config();
const {dbConnection} = require('./database/config')
const express = require('express')


var cors = require('cors')


//Crear servidor de express
const app = express();

//Configurar CORS
app.use(cors())

//Lectura y Parseo del body
app.use(express.json());

//Base de Datos 
dbConnection();

//VER Variables de entorno
//console.log(process.env);

//rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/login',require('./routes/auth'));



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