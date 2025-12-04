const express = require("express");
const router = express.Router();
const { getCaptcha } = require("../controllers/captcha.controller");

// Aquí se pasa la función getCaptcha, no el objeto captchaController completo
router.get("/", getCaptcha);

module.exports = router;
