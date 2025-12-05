//      RUTAS PARA LAS FUNCIONES DE CORREO SUSCRIPCION Y CONTACTO 

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const correoContoller = require('../controllers/correo.controller');

// Imports de express
const express = require ('express');
const router = express.Router();

// Ruta para el correo de la Suscripcion --------------------------------------------------------------------------------------------------
router.post('/suscripcion', tokens.verifyToken, correoContoller.enviarCorreoSub);

// Ruta para el correo del Contacto --------------------------------------------------------------------------------------------------
router.post('/contacto', tokens.verifyToken, correoContoller.enviarCorreoContacto);

module.exports = router;
