module.exports = (req, res, next) => {
  console.log("Captcha recibido:", req.body.captcha);
  console.log("Captcha en sesión:", req.session.captcha);

  if (!req.session.captcha) {
    return res.status(400).json({ success: false, message: "Captcha expirado o no generado." });
  }

  if (req.session.captcha.toLowerCase() !== req.body.captcha.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Captcha incorrecto." });
  }

  // Limpiar captcha usado
  delete req.session.captcha;

  next();
};
