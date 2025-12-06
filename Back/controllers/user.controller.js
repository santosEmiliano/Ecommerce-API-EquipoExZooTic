const userModel = require("../model/userModel");
const cosasTokens = require("./token.controller");
const { validarCaptcha } = require("./captcha.controller");
const tokenfunctions = require("./token.controller");

const bcrypt = require("bcryptjs"); //dependencia de hash
const nodemailer = require('nodemailer');

// Configuramos transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

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
    const { correo, contrasena, captcha, captchaId } = req.body;

    console.log("Correo recibido:", correo);
    console.log("Contraseña recibida:", contrasena);
    console.log("Captcha recibido:", captcha);
    console.log("CaptchaId recibido:", captchaId);


    if (!captcha) {
      return res.status(400).json({ mensaje: "Faltan captcha!!" });
    }

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: "Faltan datos!!" });
    }

    //deshashear (es mas como desencriptar)
    // Verificar CAPTCHA primero
    

    if (!(await validarCaptcha(captchaId, captcha))) {
      return res.status(400).json({ success: false, message: "Captcha incorrecto" });
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

const solicitarRecuperacion = async (req, res) => {
  const {correo} = req.body;

  try{
    // Verificamos que el usuario exista
    const user = await userModel.buscarCorreo(correo);

    if(!user){
      return res.json({ message: "No se encontro el usuario."});
    }

    // Generar token
    const token = tokenfunctions.generarToken(user.id);

    // Guardamos el token en base de datos
    const guardado = await userModel.guardarTokenRecuperacion(correo, token);

    if(!guardado){
      return res.status(500).json({message: "Error al guardar el token."});
    }

    const link = `https://exzootic.store/restablecer.html?token=${token}`;

    const mailOptions = {
      from: `"ExZooTic - Soporte" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: "Recupera tu acceso a la selva 🔐",
      html: `
        <div style="font-family: sans-serif; text-align: center; color: #333;">
          <h1 style="color: #4C5F41;">Recuperación de Contraseña</h1>
          <p>Hola <strong>${user.nombre}</strong>,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Da click en el siguiente botón para crear una nueva:</p>
          <br>
          <a href="${link}" style="background-color: #E67E22; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
          <br><br>
          <p style="font-size: 12px; color: #777;">Este enlace expira en 1 hora.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({mensaje: "Correo enviado. Revisa tu bandeja de entrada. ;)"});
  } catch(error){
    console.error("Error al recuperar contraseña:", error);
    res.status(500).json({message: "Error interno del servidor en la recuperacion de contraseña"});
  }
}

const restablecerContrasena = async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  try{
    // Buscamos el usuario por token
    const user = await userModel.buscarToken(token);

    if(!user){
      return res.status(400).json({ message: "El enlace es invalido o ha expirado."});
    }

    // Encriptamos la nueva contraseña
    const saltos = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nuevaContrasena, saltos);

    // Actualizamos la nueva base de datos
    const actualizando = await userModel.actualizarContrasena(user.id, hash);

    if(actualizando){
      res.json({message: "¡Contraseña Actualizada con Exito!"});
    } else{
      res.status(500).json({message: "No se pudo actualizar la contrasña :(."});
    }
  } catch (error) {
    console.error("Error al restablecer:", error);
    res.status(500).json({message: "Error en el servidor al actualizar contraseña"});
  }
}

const guardarPreferencias = async (req, res) => {
  try {
    const userId = req.userId; 
    const { tema, zoom } = req.body;

    if (!userId) {
      return res.status(401).json({ mensaje: "Usuario no identificado" });
    }

    const actualizado = await userModel.actualizarPreferencias(userId, tema, zoom);

    if (actualizado) {
      return res.status(200).json({ mensaje: "Preferencias guardadas" });
    } else {
      return res.status(500).json({ mensaje: "Error al guardar en BD" });
    }
  } catch (error) {
    console.error("Error en controller preferencias:", error);
    return res.status(500).json({ mensaje: "Error del servidor" });
  }
};

module.exports = {
  createUser,
  login,
  logOut,
  solicitarRecuperacion,
  restablecerContrasena,
  guardarPreferencias
};
