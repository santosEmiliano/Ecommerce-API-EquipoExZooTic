const { validarCaptcha } = require("../controllers/captcha.controller");

module.exports = (req, res, next) => {
  const { captcha } = req.body;

  console.log("Captcha recibido:", captcha);
  console.log("Captcha en sesión:", req.session.captcha);

  if (!validarCaptcha(req, captcha)) {
    return res.status(400).json({ success: false, message: "Captcha incorrecto o expirado." });
  }

  next();
};
