const pool = require('../db/conexion');

//  CONJUNTO DE FUNCIONES PARA EL MANEJO DEL CARRITO

//Funcion para obtener el carrito mediante la id del usuario
async function getCarritoUsuario(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM carritos WHERE usuario = ?', [id]);
        return rows;  
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return null;
    }  
}

async function deleteCarrito(id) {
    try {
        const [result] = await pool.query('DELETE FROM carritos WHERE usuario = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error("Error al eliminar los productos del carrito:", error);
        return null; 
    }
}

module.exports = {
    getCarritoUsuario,
    deleteCarrito
}