//      RUTAS PARA LAS FUNCIONES CRUD (Create, Read, Update y Delete)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE


//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const crudFunctions = require('../controllers/crud.controller');

//Imports de express
const express = require("express");
const router = express.Router();


//  Ruta para obtener todos los productos (Y sus derivadas de Query Params) -----------------------------------------------------------------------------------------------------------------------
router.get('/productos', crudFunctions.readProductos);

//Descripcion del funcionamiento y llamada
/*

*/

//  Ruta para obtener un solo producto por su ID -----------------------------------------------------------------------------------------------------------------------
router.get('/productos/:id', crudFunctions.readProdId);

//Descripcion del funcionamiento y llamada
/*

*/

//  Ruta para agregar un producto -----------------------------------------------------------------------------------------------------------------------
router.post('/productos', ); 

//Descripcion del funcionamiento y llamada
/*

*/

//  Ruta para modificar un producto -----------------------------------------------------------------------------------------------------------------------
router.put('productos/:id', )

//Descripcion del funcionamiento y llamada
/*

*/

//  Ruta para eliminar un producto -----------------------------------------------------------------------------------------------------------------------

router.delete('/productos/:id', );

//Descripcion del funcionamiento y llamada
/*

*/


//      --------------------------------------------------------------------- N O T A S -----------------------------------------------------------------

/*
    1.- A estas funciones todavia les falta cosas como el verifyToken

    2.- Todavia no esta planteada la funcion de subirImagenes hasta este commit

    3.- Las funciones son largas y requieren varias cosas, asi que cualquier duda estoy presente
*/