const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const { buscarId } = require("../model/userModel");

const redis = require("../redisCliente/redisCliente");

//creacion de tokens
//logearse, relogearse, crear usuario

function generarToken(userId) {
  const token = jwt.sign(
    {
      id: userId,
    },
    JWT_SECRET,
    { expiresIn: "1h" } //tiempo de expiracion
  );

  return token;
}

//obtencion de datos de tokens (nombre,pais,suscripcion,admin)
const datosToken = async (req, res) => {
  try {
    const user = await buscarId(req.userId);
    if (!user) {
      return res
        .status(400)
        .json({ mensaje: "usuario no encontrado o no recibido!" });
    }

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ mensaje: "error al obtener los datos!" });
  }
};

const revocador = async (token) => {
  if (!token) {
    console.log("revocador: token vacío, no se puede guardar");
    return;
  }

  try {
    await redis.set(token, "revocado", { ex: 3600 });
    console.log("Token revocado guardado en Redis");
  } catch (err) {
    console.error("Error guardando token en Redis:", err);
  }
};

module.exports = {
  generarToken,
  datosToken,
  revocador,
};
