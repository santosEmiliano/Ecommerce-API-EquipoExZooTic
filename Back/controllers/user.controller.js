const userModel = require('../model/userModel');
const cosasTokens= require("./tokens.controller");


const createUser= async(req,res)=>{//solo crea el usuario NO MAS
    
    try{
        const {nombre, correo, contrasena, pais} = req.body;
        
        if(!nombre || !correo || !contrasena || !pais){
            return res.status(400).json({mensaje: "falta de dato!!"});//puede servir para testear quietar si se verifica en el front!
        }

        //buscar que no haya usuarios con mismo nombre o correo lolololo
        const coincidencia=await userModel.coincidencias(nombre,correo);
        if(coincidencia.length > 0){
             return res.status(400).json({message: "Nombre o correo ya están en uso"});

        }

        const userId=await userModel.userNew(nombre,correo,contrasena,pais);

        const token=cosasTokens.generarToken(userId);//obtienes tu token

        return res.status(200).json({mensaje:"usuario creado exitosamente!",userId,token});
        
        
    }catch(error){
        console.error("error al crear usuario",error);
        res.status(500).json({ mensaje: 'Error al crear el usuario' });
    }
};

//logearse
const login =async(req,res)=>{
    try{
        const {correo,contrasena}=req.body;
        if(!correo || !contrasena){
            return res.status(400).json({mensaje: "Faltan datos!!"});
        }

        const userId=await userModel.logear(correo,contrasena);

        if(userId===null){
            return res.status(400).json({mensaje: "usuario no encontrado"});
        }

        const token=cosasTokens.generarToken(userId);//obnetn el madito token

        return res.status(200).json({mensaje:"Logeado!",userId,token});

    }catch(error){
        return res.status(500).json({mensaje: "error al logearse!"});
    }
}





module.exports={
    createUser,
    login
};