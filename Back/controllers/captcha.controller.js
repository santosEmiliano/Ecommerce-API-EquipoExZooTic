const svgCaptcha = require("svg-captcha");

exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f1",
  });

  req.session.captcha = captcha.text.toLowerCase();
  res.type("svg");
  res.status(200).send(captcha.data);
};

exports.validarCaptcha = (inputText, req) => {
  const guardadoC=req.session.captcha;
  return inputText && inputText.toLowerCase() === guardadoC;
};