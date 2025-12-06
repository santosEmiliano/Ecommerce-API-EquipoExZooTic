const svgCaptcha = require("svg-captcha");
const redis = require("../redisCliente/redisCliente"); // tu archivo con Upstash

// Generar captcha
exports.getCaptcha = async (req, res) => {
  const captcha = svgCaptcha.create({ size: 5, noise: 2, color: true, background: "#f4f4f1" });
  const captchaId = Math.random().toString(36).substring(2, 12);
  const texto = captcha.text.toLowerCase();

  try {
    // Guardar en Redis con TTL de 5 minutos
    await redis.set(captchaId, texto, { ex: 300 }); // 300 segundos = 5 min
    res.json({ captchaId, svg: captcha.data });
  } catch (error) {
    console.log("Error Redis set:", error);
    res.status(500).json({ message: "Error generando captcha" });
  }
};

// Validar captcha


exports.validarCaptcha = async (captchaId, captcha) => {
  try {
    const correcto = await redis.get(captchaId);
    if (!correcto) return false;

    const esValido = correcto === captcha.toLowerCase();

    if (esValido) {
      await redis.del(captchaId); // eliminar captcha usado
    }

    return esValido;
  } catch (error) {
    console.log("Error Redis validarCaptcha:", error);
    return false;
  }
};