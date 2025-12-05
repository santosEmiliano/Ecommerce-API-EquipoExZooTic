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

async function addProducto(userId, prodId, cantidad) {
    try {
        const cantSolicitada = parseInt(cantidad); // Sacamos el parseInt

        const [productoInfo] = await pool.query('SELECT existencias FROM productos WHERE id = ?', [prodId]); //Sacamos las existencias
        
        const [existente] = await pool.query('SELECT * FROM carritos WHERE usuario = ? AND producto = ?', [userId, prodId]); //Para checar si ya esta en el carrito

        if (productoInfo.length === 0) return -1; //Checamos si existe

        const stock = productoInfo[0].existencias;
        let cantidadTotal = cantSolicitada; // Empezamos asumiendo que es solo lo nuevo

        // Si ya existe en el carrito, la cantidad final será: Lo que hay + Lo nuevo
        if (existente.length > 0) {
            cantidadTotal += existente[0].cantidad;
        }

        //COMPARAMOS FINALMENTE CON EL STOCK
        if (stock < cantidadTotal) {
            console.log(`Intento de exceder stock. Stock: ${stock}, Solicitado Total: ${cantidadTotal}`);
            return -1; // Retorna error si la suma total supera el stock
        }

        if (existente.length > 0) { //Caso de si existe ya
            const [result] = await pool.query('UPDATE carritos SET cantidad = ? WHERE usuario = ? AND producto = ?', [cantidadTotal, userId, prodId]);
            return result.affectedRows;
        } else { //Si no existe hacemos un insert normalito
            const [result] = await pool.query('INSERT INTO carritos (usuario, producto, cantidad) VALUES (?, ?, ?)', [userId, prodId, cantSolicitada]);
            return result.affectedRows;
        }

    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        return null; 
    }
}

async function updateProducto(userId, prodId, nuevaCantidad) {
    try {
        const [existente] = await pool.query('SELECT * FROM carritos WHERE usuario = ? AND producto = ?', [userId, prodId]); //Para checar si ya esta en el carrito

        const [productoInfo] = await pool.query('SELECT existencias FROM productos WHERE id = ?', [prodId]); //Sacamos las existencias

        if (productoInfo.length === 0 || existente.length === 0) {
            return null;
        }

        if (productoInfo[0].existencias < nuevaCantidad) {
            console.log(`Intento de exceder stock en actualizacion de cantidad. Stock: ${productoInfo[0].existencias}, Solicitado Total: ${nuevaCantidad}`);
            return -1; // Retorna error si la suma total supera el stock
        }

        const [result] = await pool.query(
            'UPDATE carritos SET cantidad = ? WHERE usuario = ? AND producto = ?', [nuevaCantidad, userId, prodId]);
        return result.affectedRows;
    } catch (error) {
        console.error("Error al modificar el producto del carrito:", error);
        return null; 
    }
}

async function deleteProducto(userId,prodId) {
    try {
        const [result] = await pool.query('DELETE FROM carritos WHERE usuario = ? AND producto = ?', [userId, prodId]);
        return result.affectedRows;
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
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

async function getCarritoFront(idUser) {
    try {
        const query = `
            SELECT 
                p.id, 
                p.nombre, 
                p.precio, 
                p.imagen, 
                p.categoria,
                c.cantidad 
            FROM carritos c
            JOIN productos p ON c.producto = p.id
            WHERE c.usuario = ?
        `;
        const [rows] = await pool.query(query, [idUser]);
        return rows;  
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return null;
    }
}

module.exports = {
    getCarritoUsuario,
    addProducto,
    updateProducto,
    deleteProducto,
    deleteCarrito,
    getCarritoFront
}