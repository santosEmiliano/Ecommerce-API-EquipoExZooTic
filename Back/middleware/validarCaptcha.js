const { validarCaptcha } = require("../controllers/captcha.controller");

module.exports = async (req, res, next) => {
  const { captchaId, captcha } = req.body;

  try {
    const esValido = await validarCaptcha(captchaId, captcha);

    if (!esValido) {
      return res.status(400).json({ success: false, message: "Captcha incorrecto o expirado." });
    }

    console.log("Captcha validado correctamente");
    next();
  } catch (error) {
    console.log("Error validando captcha:", error);
    res.status(500).json({ success: false, message: "Error al validar captcha" });
  }
};