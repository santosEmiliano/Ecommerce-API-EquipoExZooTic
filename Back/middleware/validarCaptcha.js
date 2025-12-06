const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;

  const guardado = captchas[captchaId];

  if (!guardado || guardado !== captcha.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Captcha inválido." });
  }

  delete captchas[captchaId]; // eliminarlo después de usarlo

  next();
};
