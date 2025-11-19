//      RUTAS PARA LAS FUNCIONES CRUD (Create, Read, Update y Delete)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const subirImagen = require('../middleware/subirImagen');


//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const crudFunctions = require('../controllers/crud.controller');

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener todos los productos (Y sus derivadas de Query Params) -----------------------------------------------------------------------------------------------------------------------
router.get('/productos', crudFunctions.readProductos);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a enviar directamente todos los productos que esten guardados en el registro, asi como las url de las imagenes que estan en una carpeta publica

    llamada:

    const params = new URLSearchParams(filtros).toString(); /Parametros del query params para los filtros

    try {
        const response = await fetch(http://localhost:3000/productos?${params});
        if (!response.ok) throw new Error("Error al obtener productos");
        
        const data = await response.json(); //Informacion
    } catch (error) {
        console.error(error);
    }
*/

//  Ruta para obtener un solo producto por su ID -----------------------------------------------------------------------------------------------------------------------
router.get('/productos/:id', crudFunctions.readProdId);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a retornar un producto segun la id que tenga el producto y que se envie

    llamada:

    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`);
        
        if (response.status === 404) {
            alert("Producto no encontrado");
            return;
        }
        const data = await response.json();
    } catch (error) {
        console.error(error);
    }
*/

//  Ruta para agregar un producto -----------------------------------------------------------------------------------------------------------------------
router.post('/productos', subirImagen.single('imagen'), crudFunctions.createProduct); 

//Descripcion del funcionamiento y llamada
/*
    Esta ruta cuando se haga post servira para subir un producto junto con su imagen a la base de datos

    llamada:

    const inputImagen = document.querySelector('#inputImagen'); // como sea que tengan el html que agarra las imagenes
    
    const formData = new FormData();
    // Los nombres ("keys") de los datos deben coincidir con lo que espera tu backend (req.body) porfa

    //Aca lo agarran de donde ocupen, estos son solo datos de ejemplo
    formData.append("nombre", "Changa");
    formData.append("categoria", "Chucha loca");
    formData.append("descripcion", "El diablo le tiene miedo");
    formData.append("precio", 1500000000000000000.50);
    formData.append("existencias", 1);
    formData.append("descuento", 0);
    
    // 'imagen' debe coincidir con upload.single('imagen') en tu ruta tambien porfa que sino se traba esto
    if(inputImagen.files){
        formData.append("imagen", inputImagen.files); 
    }

    try {
        const response = await fetch("http://localhost:3000/productos", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Creado con ID:", result.id);
        } else {
            console.error("Error:", result.message);
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
*/

//  Ruta para modificar un producto -----------------------------------------------------------------------------------------------------------------------
router.put('/productos/:id', subirImagen.single('imagen'), crudFunctions.updateProduct)

//Descripcion del funcionamiento y llamada
/*
    Esto sirve para modificar cualquier parte de algun registro que se ocupe

    llamada:

    const inputImagen = document.querySelector('#inputImagen'); // como sea que tengan el html que agarra las imagenes
    
    const formData = new FormData();
    // Los nombres ("keys") de los datos deben coincidir con lo que espera tu backend (req.body) porfa
    //Aca agregan lo que se haya modificado y si no, checan de agregar los datos que ya estaban, si quieren que esto cambie me avisan
    formData.append("nombre", "Changa");
    formData.append("categoria", "Chucha loca");
    formData.append("descripcion", "El diablo le tiene miedo");
    formData.append("precio", 1500000000000000000.50);
    formData.append("existencias", 1);
    formData.append("descuento", 0);
    
    // Maneje para que la imagen no fuera necesario modificarla, si no la modifican se queda la misma y ya
    if(inputImagen.files){
        formData.append("imagen", inputImagen.files); 
    }

    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "PUT",
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Producto actualizado result);
        } else {
            console.error("Error:", result.message);
        }
    } catch (error) {
        console.error(error);
    }
*/

//  Ruta para eliminar un producto -----------------------------------------------------------------------------------------------------------------------

router.delete('/productos/:id', crudFunctions.deleteProduct );

//Descripcion del funcionamiento y llamada
/*
    Esta va a eliminar cualquier registro segun la id que se mande

    llamada:

    const id //Aca depende de como quieran manejar la id, sea sacandola por innerhtml o por parametro de funcion, como vean

    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log("Producto eliminado correctamente");
        } else {
            console.error("Error:", result.message);
        }
    } catch (error) {
        console.error(error);
    }
*/


//      --------------------------------------------------------------------- N O T A S -----------------------------------------------------------------

/*
    1.- A estas funciones todavia les falta cosas como el verifyToken

    2.- Las funciones son largas y requieren varias cosas, asi que cualquier duda estoy presente
*/