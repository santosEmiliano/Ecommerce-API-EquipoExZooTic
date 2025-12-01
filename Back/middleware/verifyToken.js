const jwt = require("jsonwebtoken");
const { buscarId } = require("../model/userModel");
const redis = require("../redisCliente/redisCliente");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Formato inválido.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const estaRevocado = await redis.get(token);

    if (estaRevocado) {
      return res.status(401).json({ mensaje: "Token revocado" });
    }

    // if(revocado){
    //   return res.status(401).json({mensaje: "Token revocado (sesion terminada)"});
    // }

    req.userId = decoded.id;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado. Haga login de nuevo.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido o manipulado.",
      });
    }

    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar el token.",
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await buscarId(req.userId);

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (user.admin !== 1) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado: solo administradores" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error verificando rol de admin" });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
