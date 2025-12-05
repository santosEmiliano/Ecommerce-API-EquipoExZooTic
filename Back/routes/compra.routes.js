//      RUTAS PARA LAS FUNCIONES DE COMPRA (Obtener datos de compra, confirmar compra)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const compraFunctions = require('../controllers/compra.controller');

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener enviar los datos de la compra al front -----------------------------------------------------------------------------------------------------------------------
router.get('/compra/:id', tokens.verifyToken ,compraFunctions.obtenerResumenCompra);

//  Ruta para confirmar la compra -----------------------------------------------------------------------------------------------------------------------
router.post('/compra/:id', tokens.verifyToken ,compraFunctions.confirmarCompra);

// Ruta de los códigos de los cupones
router.get('/cupon/:codigo', tokens.verifyToken ,compraFunctions.verificarCupon);

module.exports = router;