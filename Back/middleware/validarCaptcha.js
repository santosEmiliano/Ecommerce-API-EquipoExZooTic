const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;

  const guardado = captchas[captchaId];

  console.log("req.body:", req.body);
  console.log("captchaId:", captchaId, "captchaTxt:", captcha);


  if (!guardado || guardado.toLowerCase() !== captcha.toLowerCase()) {
  return res.status(400).json({ success: false, message: "Captcha inválido." });
}

  delete captchas[captchaId]; // eliminarlo después de usarlo

  next();
};
