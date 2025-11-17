//Importaciones de las librerias
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//Importaciones de las rutas
const crudRoutes = require('./routes/crud.routes'); //Rutas del CRUD
//Importacion de la conexion a la base de datos
const pool = require('./db/conexion'); 

//Configuracion del app de express y del puerto
const app = express();
const PORT = process.env.PORT || 3000;

//Activamos el cors
app.use(cors());
app.use(express.json());

// Funcion que hace una consulta de prueba mínima que
// confirma que todo el circuito conexión → consulta → respuesta está funcionando

app.use('./media/images', express.static(path.join(__dirname, 'images')));//hacer la carpeta imagenes publica
//dara problemas con el CORBS no CORS 

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result'); 
        console.log('Conexión a la base de datos establecida correctamente');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
    }
}

app.listen(PORT, async () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
    console.log('Comprobando conexion con la base de datos...');
    await testConnection();
});