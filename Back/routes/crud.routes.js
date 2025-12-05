//      RUTAS PARA LAS FUNCIONES CRUD (Create, Read, Update y Delete)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const subirImagen = require("../middleware/subirImagen");
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const crudFunctions = require("../controllers/crud.controller");

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener todos los productos (Y sus derivadas de Query Params) -----------------------------------------------------------------------------------------------------------------------
router.get("/productos", crudFunctions.readProductos);

//  Ruta para obtener un solo producto por su ID -----------------------------------------------------------------------------------------------------------------------
router.get("/productos/:id", crudFunctions.readProdId);

//  Ruta para agregar un producto -----------------------------------------------------------------------------------------------------------------------
router.post(
  "/productos",
  tokens.verifyToken,
  tokens.verifyAdmin,
  subirImagen.single("imagen"),
  crudFunctions.createProduct
);

//  Ruta para modificar un producto -----------------------------------------------------------------------------------------------------------------------
router.put(
  "/productos/:id",
  tokens.verifyToken,
  tokens.verifyAdmin,
  subirImagen.single("imagen"),
  crudFunctions.updateProduct
);

//  Ruta para eliminar un producto -----------------------------------------------------------------------------------------------------------------------

router.delete(
  "/productos/:id",
  tokens.verifyToken,
  tokens.verifyAdmin,
  crudFunctions.deleteProduct
);


module.exports = router;