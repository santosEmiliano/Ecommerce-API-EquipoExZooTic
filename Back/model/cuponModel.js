const pool = require('../db/conexion');

//  CONJUNTO DE FUNCIONES PARA MANEJAR LOS CUPONES

// Funcion para obtener el cupo de manera random
async function getCuponRandom() {
    try{
        const [rows] = await pool.query('SELECT * FROM cupones ORDER BY RAND() LIMIT 1');
        return rows [0];
    } catch (error){
        console.log("Error al obtener el cupon random:", error)
        return null;
    }
    
}

//Funcion para obtener un cupon
async function getCupon(codigo) {
    try {
        const [rows] = await pool.query('SELECT * FROM cupones WHERE codigo = ?', [codigo]);
        return rows[0];
    } catch (error) {
        console.error("Error al buscar el cupon:", error);
        return null;
    }
}

// Funcion para verificar el uso del cupon
async function verificarUso(userId, cuponId) {
    try {
        const [rows] = await pool.query('SELECT * FROM cupones_uso WHERE id_usuario = ? AND id_cupon = ?', [userId, cuponId]);
        if (rows.length>0) {
            return false;
        } else {
            const [result] = await pool.query('INSERT INTO cupones_uso (id_usuario, id_cupon) VALUES (?, ?)', [userId, cuponId]);
            return true;
        }
    } catch (error) {
        console.error("Error al verificar el uso del cupon por parte del usuario:", error);
        return null;
    } 
}

module.exports = {
    getCupon,
    getCuponRandom,
    verificarUso
}