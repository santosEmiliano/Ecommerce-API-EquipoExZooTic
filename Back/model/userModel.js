//agregar la base de datos de usuarios 
const pool = require('../db/conexion');

const bcrypt = require("bcryptjs");


//crea nuevo usuario no mas
async function userNew(nombre,correo,contrasena,pais) {
    const [rows] = await pool.query(
        "INSERT INTO users (nombre, correo, contrasena, pais) VALUES (?, ?, ?, ?)",//el query ese
        [nombre, correo, contrasena, pais]//datos que se mandan
    );
    return rows.insertId;//genera id automatico
}

//regresa usuario si es que tiene un nombre o un usuario similar !
async function coincidencias(nombre,correo) {
    const [rows] = await pool.query(
    "SELECT * FROM users WHERE correo = ? OR nombre = ?",
    [correo, nombre]
    );

    if(rows.length === 0){
        return null;
    }

    return rows[0].id;//por seguridad solo regresamos el ID
}


//logear usuario por correo y contrasena
// 
async function logear(correo,contrasena) {
    const [rows] = await pool.query(
    "SELECT * FROM users WHERE correo = ?",
    [correo]
    );
    if(rows.length === 0){
        return null;
    }

    const coincidencia=await bcrypt.compare(contrasena,rows[0].contrasena);
    

    if(coincidencia){//mandar datos :O
        return rows[0].id;
    }

    return null;
}

//buscar por id
async function buscarId(id) {//modificar para no mandar contrasena
    const [rows] = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
    );
    if(rows.length === 0){
        return null;
    }

    const datos={
        id: rows[0].id,
        nombre: rows[0].nombre,
        correo: rows[0].correo,
        pais: rows[0].pais,
        suscripcion: rows[0].suscripcion,
        admin: rows[0].admin
    }


    return datos;
}


module.exports={
    userNew,
    coincidencias,
    logear,
    buscarId
};