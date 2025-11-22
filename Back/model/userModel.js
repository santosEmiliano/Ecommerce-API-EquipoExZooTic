//agregar la base de datos de usuarios 
const pool = require('../db/conexion');

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
    return rows;
}


//logear usuario por correo y contrasena
// 
async function logear(correo,contrasena) {
    const [rows] = await pool.query(
    "SELECT * FROM users WHERE correo = ? AND contrasena = ?",
    [correo, contrasena]
    );
    if(rows.length === 0){
        return null;
    }
    return rows[0].id;
}


//buscar por id
async function buscarId(id) {
    const [rows] = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
    );
    if(rows.length === 0){
        return null;
    }
    return rows[0];
}


module.exports={
    userNew,
    coincidencias,
    logear,
    buscarId
};