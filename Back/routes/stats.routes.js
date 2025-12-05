//      RUTAS PARA LAS FUNCIONES DE ESTADISTICAS (OBTENER GRAFICA)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const statsFunctions = require("../controllers/stats.controller");

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener las ventas por categoria -----------------------------------------------------------------------------------------------------------------------
router.get(
    '/ventas-categoria', 
    tokens.verifyToken, 
    tokens.verifyAdmin, 
    statsFunctions.getPorCategoria
)

//  Ruta para obtener el total vendido de la tienda
router.get(
    '/ventas-total', 
    tokens.verifyToken, 
    tokens.verifyAdmin,
    statsFunctions.getVentasTotales
)

//  Ruta para obtener un reporte de existencias por categoria
router.get(
    '/existencias', 
    tokens.verifyToken, 
    tokens.verifyAdmin,
    statsFunctions.getExistencias
)

module.exports = router;