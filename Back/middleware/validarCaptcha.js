const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;


  const guardado = captchas[captchaId];

  console.log("captchasALGO:",guardado);
  // validar existencia antes de usar toLowerCase()
  if (!guardado) {
    return res.status(400).json({ success: false, message: "Captcha inválido o expirado." });
  }

  console.log("captcha--->",captcha);
  if (guardado.toLowerCase() !== captcha.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Captcha incorrecto." });
  }

  // si es correcto, eliminarlo para que no se use otra vez
  delete captchas[captchaId];

  console.log("siguiente");
  next();
};
