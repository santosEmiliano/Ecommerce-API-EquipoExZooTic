//agregar la base de datos de usuarios
const pool = require("../db/conexion");
const bcrypt = require("bcryptjs");

//crea nuevo usuario
async function userNew(nombre, correo, contrasena, pais) {
  const [rows] = await pool.query(
    "INSERT INTO users (nombre, correo, contrasena, pais) VALUES (?, ?, ?, ?)",
    [nombre, correo, contrasena, pais] //datos que se mandan
  );
  return rows.insertId; //genera id automatico
}

//regresa usuario si es que tiene un nombre o un usuario similar!
async function coincidencias(nombre, correo) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE correo = ? OR nombre = ?",
    [correo, nombre]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0].id; //por seguridad solo regresamos el ID
}

//logear usuario por correo y contrasena
async function logear(correo, contrasena) {
  const [rows] = await pool.query("SELECT * FROM users WHERE correo = ?", [
    correo,
  ]);
  if (rows.length === 0) {
    return null;
  }

  const coincidencia = await bcrypt.compare(contrasena, rows[0].contrasena);

  if (coincidencia) {
    //mandar datos :O
    return rows[0].id;
  }

  return null;
}

//buscar por id
async function buscarId(id) {
  //modificar para no mandar contrasena
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  if (rows.length === 0) {
    return null;
  }

  const datos = {
    id: rows[0].id,
    nombre: rows[0].nombre,
    correo: rows[0].correo,
    pais: rows[0].pais,
    suscripcion: rows[0].suscripcion,
    admin: rows[0].admin,
  };

  return datos;
}

// ------------ IMPLEMTENTACION 3 INTENTOS PARA LOGEARSE -------------

// Funcion para buscar usuario por correo
async function buscarCorreo(correo) {
  try{
    const [rows] = await pool.query("SELECT * FROM users WHERE correo = ?", [correo]);
    return rows[0] || null;
  } catch (error){
    console.error("Error buscando usuario por correo:", error);
    return null;
  }
}

// Funcion para sumar intentos
async function sumarIntento(id) {
  try{
    await pool.query ("UPDATE users SET intentos = intentos + 1 WHERE id = ?", [id]);
  } catch (error){
    console.error("Error al sumar intento:", error);
  }
}

// Funcion para bloquear al usuario despues de 3 intentos
async function bloquearUsuario(id) {
  try{
    await pool.query("UPDATE users SET tiempo_bloqueo = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE id = ?", [id]);
  } catch (error){
    console.error("Error al bloquear al usuario:", error);
  }
}

// Funcion para resetear los intentos del usuario
async function resetearIntentos(id) {
  try{
    await pool.query("UPDATE users SET intentos = 0, tiempo_bloqueo = NULL WHERE id = ?", [id]);
  } catch(error){
    console.error("Error al resetear los intentos:", error);
  }
  
}

// ------------------- IMPLEMENTACION OLVIDASTE TU CONTRASEÑA -------------------------
// Guardar token de recuperacion y su expiracion
async function guardarTokenRecuperacion(email, token) {
  try{
    // El DATE_ADD(NOW(), INTERVAL 1 HOUR)  le da 1 hora de vida al token
    await pool.query("UPDATE users SET reset_token = ?, reset_expire = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE correo = ?", [token, email]);
    return true;
  } catch(error){
    console.error("Error guardando token:", error);
    return false;
  }
}

// Funcion para buscar al usuario por token no expirado
async function buscarToken(token) {
  try{
    const [rows] = await pool.query("SELECT * FROM users WHERE reset_token = ? AND reset_expire > NOW()", [token]);
    return rows[0] || null;
  } catch(error){
    console.error("Error buscando por token:", error);
    return null;
  }
}

// Funcion para actualizar la contraseña y borrar el token
async function actualizarContrasena(id, nuevaContrasena) {
  try{
    await pool.query("UPDATE users SET contrasena = ?, reset_token = NULL, reset_expire = NULL WHERE id = ?", [nuevaContrasena, id]);
    return true;
  } catch (error){
    console.error("Error actualizando password:", error);
    return false;
  }
}

// Cambiar el estado de suscripción a 1 
async function userSuscrito(id) {
  try {
    await pool.query("UPDATE users SET suscripcion = 1 WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error al marcar suscripción:", error);
    return false;
  }
}

module.exports = {
  userNew,
  coincidencias,
  logear,
  buscarId,
  buscarCorreo,
  sumarIntento,
  bloquearUsuario,
  resetearIntentos,
  guardarTokenRecuperacion,
  buscarToken,
  actualizarContrasena,
  userSuscrito
};
