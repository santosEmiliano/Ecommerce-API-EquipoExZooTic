const svgCaptcha = require("svg-captcha");

// Mapa: ip -> captcha
const captchas = new Map();

exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f1",
  });

  const ip = req.ip.replace("::ffff:", "");

  captchas.set(ip, captcha.text.toLowerCase());

  res.type("svg");
  res.status(200).send(captcha.data);
};

exports.validarCaptcha = (inputText, req) => {
  const ip = req.ip.replace("::ffff:", "");
  const stored = captchas.get(ip);

  return inputText && inputText.toLowerCase() === stored;
};