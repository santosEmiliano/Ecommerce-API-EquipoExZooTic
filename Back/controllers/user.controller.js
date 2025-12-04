const userModel = require("../model/userModel");
const cosasTokens = require("./token.controller");
const { validarCaptcha } = require("./captcha.controller");

const bcrypt = require("bcryptjs"); //dependencia de hash

const createUser = async (req, res) => {
  try {
    const { nombre, correo, contrasena, pais } = req.body;

    if (!nombre || !correo || !contrasena || !pais) {
      return res.status(400).json({ mensaje: "falta de dato!!" });
    }

    //buscar que no haya usuarios con mismo nombre o correo
    const coincidencia = await userModel.coincidencias(nombre, correo);
    if (coincidencia) {
      return res
        .status(400)
        .json({ message: "Nombre o correo ya están en uso" });
    }
    //hash de contrasena!!!!!!!
    const saltos = await bcrypt.genSalt(10); //cuantos saltos hace son 10
    const hash = await bcrypt.hash(contrasena, saltos); //hasheamos

    const userId = await userModel.userNew(nombre, correo, hash, pais);

    const token = cosasTokens.generarToken(userId); //obtienes tu token

    return res
      .status(200)
      .json({ mensaje: "usuario creado exitosamente!", userId, token });
  } catch (error) {
    console.error("error al crear usuario", error);
    res.status(500).json({ mensaje: "Error al crear el usuario" });
  }
};

//logearse
const login = async (req, res) => {
  try {
    const { correo, contrasena, captcha } = req.body;

    if (!captcha) {
      return res.status(400).json({ mensaje: "Faltan captcha!!" });
    }

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: "Faltan datos!!" });
    }

    //deshashear (es mas como desencriptar)
    // Verificar CAPTCHA primero
    if (!validarCaptcha(captcha)) {
      return res.status(400).json({success: false, message: "Captcha incorrecto ",});
    }

    // Para loguear buscamos por correo
    /*Esto lo hago por que si esta bloqueado, a pesar de que 
    ponga la contraseña bien, si esta bloqueado, no le va a permitir
    loguearse, hasta que pase el tiempo.*/
    const user = await userModel.buscarCorreo(correo);

    if (!user) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    // Verificamos si el usuario esta bloqueado
    if (user.tiempo_bloqueo){
      const fechaAhora = new Date();
      const fechaDesbloqueo = new Date(user.tiempo_bloqueo);

      // No lo dejamos pasar si la fecha de desbloqueo es mayor a la actual
      if (fechaAhora < fechaDesbloqueo){
        const minRes = Math.ceil((fechaDesbloqueo - fechaAhora) / 60000);
        
        return res.status(403).json({mensaje: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${minRes} minutos.`});
      } else{
        // Si ya no esta bloqueado (Es decir ya paso el tiempo)
        await userModel.resetearIntentos(user.id);
        user.intentos = 0;
      }
    }

    // Verificamos contraseña
    const passValida = await bcrypt.compare(contrasena, user.contrasena);

    
    if (!passValida){
      // Si la contaseña es incorrecta
      
      await userModel.sumarIntento(user.id);
      const intentosAct = user.intentos + 1;

      // Si gasto sus 3 intentos lo bloqueamos
      if (intentosAct >= 3){
        await userModel.bloquearUsuario(user.id);
        return res.status(403).json({mensaje: "Has alcanzado 3 intentos fallidos. Cuenta bloqueada por 5 minutos."});
      }

      // Si solamente fallo 1 o 2 veces
      return res.status(400).json({mensaje: `Constraseña incorrecta. Te quedan ${3 - intentosAct} intentos.`});
    }

    // Si ya paso todas las validaciones, lo logueamos
    await userModel.resetearIntentos(user.id);

    const token = cosasTokens.generarToken(user.id); //obten el token
    const datos = await userModel.buscarId(user.id);

    return res.status(200).json({ mensaje: "Logeado!", token, datos });
  } catch (error) {
    return res.status(500).json({ mensaje: "error al logearse!" });
  }
};

//logout
const logOut = async (req, res) => {
  const token = req.token;
  await cosasTokens.revocador(token);
  res.json({ mensaje: "Toekn revocado con exito" });
};

module.exports = {
  createUser,
  login,
  logOut,
};
