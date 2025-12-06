const svgCaptcha = require("svg-captcha");
const { v4: uuidv4 } = require("uuid");

// Aquí guardamos captchas por id
const captchas = {};

exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f1",
  });

  const captchaId = uuidv4(); // id único para este usuario
  captchas[captchaId] = captcha.text.toLowerCase();

  res.status(200).json({
    id: captchaId,
    svg: captcha.data,
  });
};

exports.validarCaptcha = (id, inputText) => {
  if (!captchas[id]) return false;

  const valido = inputText.toLowerCase() === captchas[id];

  // puedes eliminar el captcha después de usarlo (opcional)
  delete captchas[id];

  return valido;
};