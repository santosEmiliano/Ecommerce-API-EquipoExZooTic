const { captchas } = require("../controllers/captcha.controller");

function validateCaptcha(req, res, next) {
  const { captchaId, captchaText } = req.body;
  const validCaptcha = captchas[captchaId];

  if (!validCaptcha || validCaptcha !== captchaText.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Captcha invalido." });
  }

  delete captchas[captchaId];
  next(); // Si todo está bien, pasa al siguiente paso (el login)
}

module.exports = validateCaptcha;
