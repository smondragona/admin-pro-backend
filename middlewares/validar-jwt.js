const jwt = require('jsonwebtoken')

const validarJWT = (req, res, next) => {

    // Leer el token
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.JWT_TOKEN);
        req.id = uid;
        //console.log(uid)
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

    
}

module.exports = {
    validarJWT
}