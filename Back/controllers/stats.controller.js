//  CONTROLADOR DE LAS RUTAS DE COMPRA

//Import de los model que se encargan de las funciones en base de datos
const ventasModel = require('../model/ventasModel');
const crudModel = require('../model/crudModel');

const getPorCategoria = async (req, res) => {
    try {
        const array = await ventasModel.obtenerVentas();
        const categorias = array.map(venta => venta.categoria);
        const ventas = array.map(venta => venta.ventas);
        
        res.status(200).json({ 
            message: "Lista de ventas obtenida",
            categorias,
            ventas
        });
    } catch (error) {
        console.error('Error al obtener las ventas por categoria', error);
        res.status(500).json({ mensaje: 'Error al obtener las ventas por categoria' });
    }
}

const getVentasTotales = async (req, res) => {
    try {
        //Obtenemos los registros de las ventas
        const array = await ventasModel.obtenerVentas();

        //Obtenemos un array con solo las ventas
        const ventas = array.map(venta => venta.ventas);

        //Sacamos sumatoria de las ventas
        const total = ventas.reduce((acumulador, venta) => { return acumulador + venta; }, 0);

        res.status(200).json({ 
            message: "Lista de ventas obtenida",
            total
        });
    } catch (error) {
        console.error('Error al obtener las ventas totales', error);
        res.status(500).json({ mensaje: 'Error al obtener las ventas totales' });
    }
}

const getExistencias = async (req, res) => {
    try {
        //Obtenemos los productos
        const productos = await crudModel.getProductos();

        //Si no hay ningun producto ahora si nos preocupamos
        if (!productos) {
            return res.status(500).json({ mensaje: 'No se pudieron obtener los productos' });
        }

        //Objeto de reoprte que vamos a enviar al front
        const reporte = {};
        
        productos.map(producto => producto.categoria);

        productos.forEach(producto => {

            //Agarramos la categoria del producto
            const categoria = producto.categoria;

            // Si la categoría aún no existe en el reporte, creamos un espacio vacío para la categoria
            if (!reporte[categoria]) {
                reporte[categoria] = [];
            }

            // Agregamos el producto (Excluyendo algunos datos) a esa categoría
            reporte[categoria].push({
                id: producto.id,
                nombre: producto.nombre,
                existencias: producto.existencias
            });
        });
        res.status(200).json({ 
            message: "Reporte de existencias generado",
            reporte: reporte
        });
    } catch (error) {
        console.error('Error al obtener el reporte de existencias', error);
        res.status(500).json({ mensaje: 'Error el reporte de existencias' })
    }
}

module.exports = {
    getPorCategoria,
    getVentasTotales,
    getExistencias
}