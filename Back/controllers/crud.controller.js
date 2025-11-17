//  CONTROLADOR DE LA RUTAS CRUD

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
        products.imagen

        res.json();
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
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ mensaje: 'Error al obtener el producto' });
    }
};

const createProduct = async (req, res) => {
    
};

module.exports = {
    readProductos,
    readProdId
}