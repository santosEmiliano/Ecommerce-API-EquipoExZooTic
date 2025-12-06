const svgCaptcha = require("svg-captcha");

exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f1",
  });

  // Guardar el captcha en la sesión del usuario
  req.session.captcha = captcha.text.toLowerCase();

  res.json({
    svg: captcha.data
  });
};

exports.validarCaptcha = (req, captcha) => {
  if (!req.session.captcha) return false;

  const esValido = req.session.captcha === captcha.toLowerCase();

  if (esValido) {
    delete req.session.captcha; // borrar captcha usado
  }

  return esValido;
};
