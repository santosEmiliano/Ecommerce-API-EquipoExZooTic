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

  console.log("antes de tolower",captcha.text.toLowerCase());
  captchas[captchaId] = captcha.text.toLowerCase();

  console.log("que guardo captchas",captchas[captchaId]);
  // Enviar tanto la imagen como el id
  res.json({
    captchaId,
    svg: captcha.data
  });
};

exports.validarCaptcha = (captchaId, captcha) => {
  const correcto = captchas[captchaId];
  console.log("captchas",captchas[captchaId]);
  console.log("correcto",correcto);
  if (!correcto) return false;

  console.log("PASA!!!");
  const esValido = correcto === captcha.toLowerCase();

  console.log("segundo PASEEEEE");
  if (esValido) {
    delete captchas[captchaId]; // limpiar captcha usado
  }

  return esValido;
};
