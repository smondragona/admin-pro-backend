const {response} = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuarios = async (req, res = response) => {

    //console.log(req.body);

    const {password,email} = req.body;

   
    
    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        //Guardar Usuarios
        await usuario.save();

         //Generar TOKEN - JWT
         const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        });
    }
   
}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            })
        }

        //Actualización
        const {password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email){
           
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
           
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});

        res.json({
            ok:true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            ok:false,
            msg: 'Error inesperado ... revisar los logs'
        })
    }
}

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    try {
        
        const usuarioBD = await Usuario.findById(uid);

        if ( !usuarioBD ){
           return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
        ok: true,
        msg: 'El usuario fue eliminado'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el Usuario'
        });
    }
    

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}