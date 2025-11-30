//  CONTROLADOR DE LA RUTAS CRUD

//Import del carritModel, encargado de los querys y todo lo de la base de datos
const carritoModel = require('../model/carritoModel');

const readCarrito = async (req, res) => {
    const { idUsuario } = req.params;

    if (isNaN(idUsuario)) { return res.status(400).json({ mensaje: 'ID inválido, debe ser un número.' }); }
    
    try {
        const carrito = await carritoModel.getCarritoUsuario(idUsuario);

        if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

        res.json(carrito);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ mensaje: 'Error al obtener el carrito' });
    }
}

const agregarProducto = async (req, res) => {
    const { idUsuario } = req.params;
    const { idProducto, cantidad } = req.body;

    try {
        const resultado = await carritoModel.addProducto(idUsuario, idProducto, cantidad);

        //Verificamos si hubo algun error de stock
        if (resultado === -1) {
            return res.status(400).json({ 
                status: "error", 
                message: "No hay suficiente stock para agregar esa cantidad." 
            });
        }

        // Verificamos si fue un error de la base de datos
        if (resultado === null) {
            return res.status(500).json({ 
                status: "error", 
                message: "Error interno al agregar al carrito." 
            });
        }

        // Ya si nada de lo de arriba si jalo
        res.json({ 
            status: "success", 
            message: "Producto agregado al carrito correctamente" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
};

const modificarProducto = async (req, res) => {
    const {idUsuario, idProducto} = req.params;
    const { cantidad } = req.body;

    if (isNaN(idUsuario) || isNaN(idProducto)) { 
        return res.status(400).json({ mensaje: 'ID o IDs inválidos.' }); 
    }
    
    try {

        //Si me intentan poner un 0 aca, les voy a borrar su producto en el carrito, avisados
        if (cantidad === 0) {
            eliminarProducto(req, res);
        }

        const resultado = await carritoModel.updateProducto(idUsuario, idProducto, cantidad);

        if (resultado === -1) {
            return res.status(400).json({ 
                status: "error", 
                message: "No hay suficiente stock para modificar a esa cantidad." 
            });
        }

        if (resultado === null) {
            return res.status(500).json({ 
                status: "error", 
                message: "Error interno al modificar en el carrito (puede que el producto no está en el carrito)." 
            });
        }

        res.json({ 
            status: "success", 
            message: "Producto del carrito modificado correctamente" 
        });

    } catch (error) {
        console.error('Error al modificar producto del carrito:', error);
        res.status(500).json({ mensaje: 'Error al modificar producto del carrito' });
    }
}

const eliminarProducto = async (req,res) => {
    const {idUsuario, idProducto} = req.params;

    if (isNaN(idUsuario) || isNaN(idProducto)) { 
        return res.status(400).json({ mensaje: 'ID o IDs inválidos.' }); 
    }

    try {
        const resultado = await carritoModel.deleteProducto(idUsuario, idProducto);

        if (resultado === null) {
            return res.status(500).json({ 
                status: "error", 
                message: "Error interno al eliminar producto del carrito." 
            });
        }

        if (resultado === 0) {
            return res.status(404).json({ 
                mensaje: 'Producto no encontrado en el carrito' 
            });
        }

        res.json({ 
            status: "success", 
            message: "Producto del carrito eliminado correctamente" 
        });

    } catch (error) {
        console.error('Error interno al eliminar producto del carrito:', error);
        res.status(500).json({ mensaje: 'Error interno al eliminar producto del carrito' });
    }
}

const eliminarCarrito = async (req, res) => {
    const { idUsuario } = req.params;

    if (isNaN(idUsuario)) { return res.status(400).json({ mensaje: 'ID inválido, debe ser un número.' }); }
    
    try {
        const resultado = await carritoModel.deleteCarrito(idUsuario);

        if (resultado === null) {
            return res.status(500).json({ 
                status: "error", 
                message: "Error interno al eliminar carrito." 
            });
        }

        if (resultado === 0) {
            return res.status(404).json({ 
                mensaje: 'Carrito posiblemente vacio' 
            });
        }

        res.json({ 
            status: "success", 
            message: "Carrito eliminado correctamente" 
        });

    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el carrito' });
    }
}

module.exports = {
    readCarrito,
    agregarProducto,
    modificarProducto,
    eliminarProducto,
    eliminarCarrito
}