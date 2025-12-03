const pool = require('../db/conexion');

//  CONJUNTO DE FUNCIONES PARA LA TABLA DE VENTAS

async function agregarPago(ventasCategorias) {
    const categoriasVendidas = Object.keys(ventasCategorias);
    try {
        for (const categoria of categoriasVendidas) {
            const montoASumar = ventasCategorias[categoria];
            const [result] = await pool.query('UPDATE ventas SET ventas = ventas + ? WHERE categoria = ?', [montoASumar, categoria]);
        }
        return true;
    } catch (error) {
        console.error("Error al actualizar las ventas:", error);
        return null; 
    }
}

async function obtenerVentas() {
    try {
        const [rows] = await pool.query('SELECT * FROM ventas')
        return rows;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        return null; 
    }
}

module.exports = {
    agregarPago,
    obtenerVentas
}