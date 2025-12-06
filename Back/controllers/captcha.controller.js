const svgCaptcha = require("svg-captcha");

// Aquí guardaremos los captchas generados
// Ejemplo: { "ab123": "k9x2p", "f88dd": "wq7ss" }
const captchas = {};

exports.captchas = captchas;

exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f1",
  });

  // Generar un id único para este captcha
  const captchaId = Math.random().toString(36).substring(2, 12);

  // Guardar el texto del captcha
  captchas[captchaId] = captcha.text.toLowerCase();

  // Enviar tanto la imagen como el id
  res.json({
    captchaId,
    svg: captcha.data
  });
};

exports.validarCaptcha = (captchaId, captchaTxt) => {
  const correcto = captchas[captchaId];

  if (!correcto) return false;

  const esValido = correcto === captchaTxt.toLowerCase();

  if (esValido) {
    delete captchas[captchaId]; // limpiar captcha usado
  }

  return esValido;
};
