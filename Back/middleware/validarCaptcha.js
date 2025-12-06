const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;

  const guardado = captchas[captchaId];

  if (!guardado || guardado.toLowerCase() !== captcha.toLowerCase()) {
    console.log("req.body:", req.body);
    console.log("captchaId:", captchaId, "captcha enviado:", captcha);
    console.log("captcha guardado:", guardado);
    return res.status(400).json({ success: false, message: "Captcha inválido." });
  }

  // Si es correcto, eliminarlo para que no se use otra vez
  delete captchas[captchaId];

  next();
};
