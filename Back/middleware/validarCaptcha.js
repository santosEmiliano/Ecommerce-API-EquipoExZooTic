const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;

  console.log("Todos los captchas guardados:", captchas);
  console.log("CaptchaId recibido:", captchaId);

  const guardado = captchas[captchaId];
  if (!guardado) {
    return res.status(400).json({ success: false, message: "Captcha inválido o expirado." });
  }

  if (guardado.toLowerCase() !== captcha.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Captcha incorrecto." });
  }

  delete captchas[captchaId];
  next();
};
