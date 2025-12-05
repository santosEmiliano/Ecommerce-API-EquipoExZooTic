const express = require("express");
const router = express.Router();

const usersFuncion = require("../controllers/user.controller");

const tokens = require("../middleware/verifyToken");
const { datosToken } = require("../controllers/token.controller");

router.post("/login", usersFuncion.login);

router.post("/obtenerDatos", tokens.verifyToken, datosToken);

//ruta log out
router.post("/logOut", tokens.verifyToken, usersFuncion.logOut);

//crear usuario
router.post("/usuario", usersFuncion.createUser);

// Ruta para solicitar la recuperacion 
router.post("/forgot-password", usersFuncion.solicitarRecuperacion);

// Ruta para guardar la nueva contraseña 
router.post("/reset-password", usersFuncion.restablecerContrasena);

// Ruta para guardar las preferencias de la accesiblidad del user
router.post("/guardar-preferencias", tokens.verifyToken, usersFuncion.guardarPreferencias);
module.exports = router;
