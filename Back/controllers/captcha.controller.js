const svgCaptcha = require("svg-captcha");
const redis = require("../redisCliente/redisCliente"); // tu archivo con Upstash

// Generar captcha
exports.getCaptcha = async (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 5,
      noise: 2,
      color: true,
      background: "#f4f4f1",
    });

    const captchaId = Math.random().toString(36).substring(2, 12);

    // Guardar captcha en Redis con expiración de 5 minutos
    await redis.set(`captcha:${captchaId}`, captcha.text.toLowerCase(), {
      ex: 300, // segundos
    });

    res.json({
      captchaId,
      svg: captcha.data,
    });
  } catch (error) {
    console.error("Error generando captcha:", error);
    res.status(500).json({ message: "Error generando captcha" });
  }
};

// Validar captcha
exports.validarCaptcha = async (captchaId, captcha) => {
  if (!captchaId || !captcha) return false;

  const key = `captcha:${captchaId}`;
  const correcto = await redis.get(key);

  if (!correcto) return false;

  const esValido = correcto === captcha.toLowerCase();

  if (esValido) {
    await redis.del(key); // limpiar captcha usado
  }

  return esValido;
};