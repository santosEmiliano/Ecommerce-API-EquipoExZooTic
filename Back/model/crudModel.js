const pool = require('../db/conexion');

//  CONJUNTO DE FUNCIONES PARA LOS METODOS GET

//Funcion para obtener todos los productos
async function getProductos() {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        return rows;  
    } catch (error) {
        console.error("Error al buscar los productos:", error);
        return null;
    }  
}

//Funcion para obtener el producto por su ID
async function getProdID(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        return rows[0];  
    } catch (error) {
        console.error("Error al buscar el producto:", error);
        return null;
    } 
}

//NOTA: Estos no estan en la parte del CRUD tecnicamente porque son para los filtros de la tienda
//pero queria ir haciendo las funciones, si hay cualquier problema las modificare o eliminare segun se requiera.

async function getProductosFiltrados(categoria, min, max, enOferta) {
    try {
        let sql = "SELECT * FROM productos WHERE 1=1";
        const params = [];

        // Filtro Categoría
        if (categoria && categoria !== "Todas") {
            sql += " AND categoria = ?";
            params.push(categoria);
        }

        // Filtro Precio (Solo si mandaron un maximo, el minimo es opcional)
        if (max) {
            sql += " AND precio BETWEEN ? AND ?";
            params.push(min, max);
        }

        // Filtro Oferta
        if (enOferta === "true") {
            sql += " AND descuento > 0";
        }

        // Se ejecuta todo combinado
        const [rows] = await pool.query(sql, params);
        return rows;

    } catch (error) {
        console.error("Error en filtros avanzados:", error);
        return [];
    }
}

//  CONJUNTO DE RUTAS PARA EL ENVIO DE PRODUCTOS

//Funcion para agregar un producto
async function addProduct(nombre, categoria, descripcion, precio, existencias, descuento, imagen) {
    try {
        const [result] = await pool.query(
            'INSERT INTO productos (nombre, categoria, descripcion, precio, existencias, descuento, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, categoria, descripcion, precio, existencias, descuento, imagen]
        )
        return result.insertId;
    } catch (error) {
        console.error("Error al añadir el producto:", error);
        return null; 
    }
}

// Funcion para actualizar producto existente
async function updateProducto(id, nombre, categoria, descripcion, precio, existencias, descuento, imagen) {
    try {
        const [result] = await pool.query(
            'UPDATE productos SET nombre = ?, categoria = ?, descripcion = ?, precio = ?, existencias = ?, descuento = ?, imagen = ? WHERE id = ?',
            [nombre, categoria, descripcion, precio, existencias, descuento, imagen, id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error("Error al modificar el producto:", error);
        return null; 
    }
    
}

async function updateStock(id, stock) {
    try {
        const [result] = await pool.query('UPDATE productos SET existencias = ? WHERE id = ?', [stock, id]);
        return result.affectedRows;
    } catch (error) {
        console.error("Error al modificar el producto:", error);
        return null; 
    }
}

// Funcion para eliminar un producto
async function deleteProducto(id) {
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return null; 
    }
}

module.exports = {
    getProductos,
    getProdID,
    getProductosFiltrados,
    addProduct,
    updateProducto,
    updateStock,
    deleteProducto
};