//  CONTROLADOR DE LA RUTAS CRUD

// IMPORT DE FS Y PATH PARA LAS IMAGENES
const fs = require('fs');
const path = require('path');

//Import del crudModel, encargado de la conexion a la base de datos
const crudModel = require('../model/crudModel');

const readProductos = async (req, res) => {
    const { categoria, precio_min, precio_max, en_oferta } = req.query;
    let products;
    try {
        if (categoria) {
            products = await crudModel.getProdCat(categoria);
        } else if (precio_min || precio_max) {
            products = await crudModel.getProdPrice(parseFloat(precio_min), parseFloat(precio_max));
        } else if (en_oferta) {
            products = await crudModel.getProdOferta();
        } else {
            products = await crudModel.getProductos();
        }
        res.json(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los productos' });
    }
};


const readProdId = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) { return res.status(400).json({ mensaje: 'ID inválido, debe ser un número.' }); }

    try {
        const product = await crudModel.getProdID(id);

        if (!product) return res.status(404).json({ mensaje: 'Producto no encontrado' });

        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ mensaje: 'Error al obtener el producto' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { nombre, categoria, descripcion, precio, existencias, descuento } = req.body;

        let rutaImagen = null; 

        if (req.file) { rutaImagen = `/images/${req.file.filename}`; }


        const resultId = await crudModel.addProduct(
            nombre, 
            categoria, 
            descripcion, 
            parseFloat(precio), 
            parseInt(existencias), 
            parseInt(descuento), 
            rutaImagen
        );

        if (resultId) {
            res.status(201).json({ message: "Producto creado", id: resultId });
        } else {
            res.status(500).json({ message: "Error al guardar en BD" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno" });
    }
};

const updateProduct = async (req, res) => {
    try {
        //Sacamos los datos
        const { id } = req.params; 
        const { nombre, categoria, descripcion, precio, existencias, descuento } = req.body;

        //Verificamos id
        if (!id) return res.status(400).json({ message: "ID requerido" });

        //Leemos las cosas que habia antes
        const productoActual = await crudModel.getProdID(id);

        //Si no hay nada
        if (!productoActual) {
            //Si aparte de que no hay nada, por algun motivo hay una imagen, la intentamos borrar
            if (req.file) borrarImagenFisica(`/images/${req.file.filename}`);
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        //Ruta antigua
        let rutaImagenFinal = productoActual.imagen; 

        if (req.file) { //Si subieron una nueva imagen
            //Si habia una vieja la eliminamos
            if (productoActual.imagen) {
                borrarImagenFisica(productoActual.imagen);
            }

            //Hacemos la ruta de la nueva imagen
            rutaImagenFinal = `/images/${req.file.filename}`;
        } 
        
        const affectedRows = await crudModel.updateProducto(
            id,
            nombre,
            categoria,
            descripcion,
            parseFloat(precio),
            parseInt(existencias),
            parseInt(descuento),
            rutaImagenFinal
        );

        if (affectedRows > 0) {
            res.json({ 
                message: "Producto actualizado correctamente", 
                registrosModificados: affectedRows
            });
        } else {
            res.status(500).json({ message: "No se pudo actualizar el producto" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al actualizar" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; //Sacamos la id

        //Verificamos id
        if (!id) return res.status(400).json({ message: "ID requerido" });

        //Leemos las cosas que habia antes para sacar la ruta de la imagen
        const producto = await crudModel.getProdID(id);

        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

        if (producto.imagen) borrarImagenFisica(producto.imagen);

        const affectedRows = await crudModel.deleteProducto(id);

        if (affectedRows > 0) {
            res.json({ 
                message: "Producto eliminado correctamente", 
                registrosModificados: affectedRows
            });
        } else {
            res.status(500).json({ message: "No se pudo eliminar el producto" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno al eliminar" });
    }

};

const borrarImagenFisica = (rutaUrl) => {
    if (!rutaUrl) return;

    if (typeof rutaUrl !== 'string') {
        console.error("Error: La ruta no es un texto. Valor recibido:", rutaUrl);
        return;
    }
    const nombreArchivo = rutaUrl.split('/').pop();
    const rutaFisica = path.join(__dirname, '../media/images', nombreArchivo);

    if (fs.existsSync(rutaFisica)) {
        try {
            fs.unlinkSync(rutaFisica);
            console.log(`Imagen eliminada: ${rutaFisica}`);
        } catch (err) {
            console.error('Error al borrar imagen antigua:', err);
        }
    }
};

module.exports = {
    readProductos,
    readProdId,
    createProduct,
    updateProduct,
    deleteProduct
}