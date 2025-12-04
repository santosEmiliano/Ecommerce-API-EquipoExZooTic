const svgCaptcha = require("svg-captcha");

let actualCaptcha = "";

exports.getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: "#f4f4f1",
  });

  actualCaptcha = captcha.text.toLowerCase();
  res.type("svg");
  res.status(200).send(captcha.data);
};

exports.validarCaptcha = (inputText) => {
  return inputText && inputText.toLowerCase() === actualCaptcha;
};
