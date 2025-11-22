const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const {buscarId}= require("../model/userModel");

//creacion de tokens 
//solo guarda el //id mandar el id jaja
//logearse, relogearse, crear usuario

function generarToken(userId){
    const token= jwt.sign({
        id: userId

    },
    JWT_SECRET,
    {expiresIn: "1h"}//tiempo de exporacion
    );

    return token;
};





//obtencion de datos de tokens (nombre,pais,suscripcion,admin)
//obtencion de datos!
const datosToken =async(req,res)=>{
    try{
        const user=await buscarId(req.userId)
        if(!user){
            return res.status(400).json({mensaje: "usuario no encontrado o no recibido!"});
            
        }
        const datos={
            nombre: user.nombre,
            correo: user.correo,
            pais: user.pais,
            admin: user.admin,
            suscripcion: user.suscripcion
        }

        return res.status(200).json({
            user:datos
        });
        
    }catch(error){
        return res.status(500).json({mensaje: "error al obtener los datos!"});
    }

}



module.exports={
    generarToken,
    datosToken
}