//Importaciones de las librerias
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

//Importaciones de las rutas
const crudRoutes = require("./routes/crud.routes"); //Rutas del CRUD
const compraRoutes = require("./routes/compra.routes"); //Rutas de compra
const carritoRoutes = require("./routes/carrito.routes"); //Rutas del carrito
const correoRoutes = require("./routes/correo.routes"); //Rutas del correo
const userRoutes = require("./routes/user.routes"); // Rutas del usuario
const statsRoutes = require("./routes/stats.routes"); //Rutas de estadisticas del admin
const captchaRoutes = require("./routes/captcha.routes");
const chatRoutes = require('./routes/chat.routes'); // Rutas del chatbot

//Importacion de la conexion a la base de datos
const pool = require("./db/conexion");

//Configuracion del app de express y del puerto
const app = express();
const PORT = process.env.PORT || 3000;

//Activamos el cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para que entienda formularios

//Use de las rutas para que el index sepa manejarlas
app.use("/api/crud", crudRoutes);
app.use("/api", compraRoutes);
app.use("/api", carritoRoutes);
app.use("/api", correoRoutes);
app.use("/auth", userRoutes); // Endpoints de autenticación
app.use('/stats', statsRoutes);
app.use("/captcha",captchaRoutes);
app.use('/api/chat', chatRoutes);

// Funcion que hace una consulta de prueba mínima que
// confirma que todo el circuito conexión → consulta → respuesta está funcionando

app.use("/images", express.static(path.join(__dirname, "media/images"))); //hacer la carpeta imagenes publica
app.use("/cupones", express.static(path.join(__dirname, "media/cupones")));
//dara problemas con el CORBS no CORS

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Conexión a la base de datos establecida correctamente");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  }
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Servidor funcionando en http://0.0.0.0:${PORT}`);
  console.log("Comprobando conexion con la base de datos...");
  await testConnection();
});
