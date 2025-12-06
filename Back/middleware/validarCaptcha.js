const { captchas } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captchaId, captcha } = req.body;

  console.log("PID del proceso:", process.pid);
  console.log("Todos los captchas guardados:", captchas);
  console.log("CaptchaId recibido:", req.body.captchaId);
  console.log("Texto recibido:", req.body.captcha);

  const guardado = captchas[captchaId];

  console.log("captchasALGO:",guardado);
  // validar existencia antes de usar toLowerCase()
  if (!guardado) {
    console.log("Es aqui",guardado);
    return res.status(400).json({ success: false, message: "Captcha inválido o expirado." });
  }

  console.log("captcha--->",captcha);
  if (guardado.toLowerCase() !== captcha.toLowerCase()) {
    console.log("guardado:",guardado,toLowerCase());
    console.log("captcha: ",captcha.toLowerCase());
    return res.status(400).json({ success: false, message: "Captcha incorrecto." });
  }

  // si es correcto, eliminarlo para que no se use otra vez
  delete captchas[captchaId];

  next();
};
