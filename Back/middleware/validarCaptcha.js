const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;

  if (!captchaId || !captcha) {
    return res.status(400).json({ success: false, message: "Captcha y captchaId son requeridos." });
  }

  const guardado = captchas[captchaId];

  console.log("req.body:", req.body);
  console.log("captchaId:", captchaId, "captcha:", captcha);
  console.log("guardado:", guardado);

  if (!guardado || guardado.toLowerCase() !== captcha.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Captcha inválido." });
  }

  // Ya usado, eliminarlo
  delete captchas[captchaId];

  next();
};
