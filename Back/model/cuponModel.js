const pool = require('../db/conexion');

//  CONJUNTO DE FUNCIONES PARA MANEJAR LOS CUPONES

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
    verificarUso
}