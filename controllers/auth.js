const { response } = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt')

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        //Verifica Email
        const usuarioBD = await Usuario.findOne({ email });
        if(!usuarioBD){
            return res.status(404).json({
                ok: false,
                msg: 'Email no valida'
            });
        }

        //Verificar Contraseña
        const validPAssword = bcrypt.compareSync( password, usuarioBD.password );

        if( !validPAssword ){
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar TOKEN - JWT
        const token = await generarJWT(usuarioBD.id);

        res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    login
}