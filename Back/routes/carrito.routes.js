//      RUTAS PARA LAS FUNCIONES DEL CARRITO (BASICAMENTE UN CRUD DEL CARRITO)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const carritoFunctions = require('../controllers/carrito.controller');

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener los datos del carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.get('/carrito/:idUsuario', tokens.verifyToken, carritoFunctions.readCarrito);

//  Ruta para agregar un producto al carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.post('/carrito/:idUsuario', tokens.verifyToken, carritoFunctions.agregarProducto);

//  Ruta para modificar un producto en el carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.put('/carrito/:idUsuario/producto/:idProducto', tokens.verifyToken, carritoFunctions.modificarProducto);

//  Ruta para eliminar un producto del carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.delete('/carrito/:idUsuario/producto/:idProducto', tokens.verifyToken, carritoFunctions.eliminarProducto);

//  Ruta para eliminar todo el carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.delete('/carrito/:idUsuario', tokens.verifyToken, carritoFunctions.eliminarCarrito);

module.exports = router;