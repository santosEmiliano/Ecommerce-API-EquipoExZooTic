//      RUTAS PARA LAS FUNCIONES DEL CARRITO (BASICAMENTE UN CRUD DEL CARRITO)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const carritoFunctions = require('../controllers/carrito.controller');

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener los datos del carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.get('/carrito/:idUsuario', carritoFunctions.readCarrito);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a enviar un array con los productos y la cantidad de estos del carrito de un usuario segun su id

    llamada:

    try {
        const response = await fetch(`http://localhost:3000/carrito/{id}`);
        
        if (response.status === 404) {
            alert("Carrito no encontrado");
            return;
        }
        const data = await response.json();
    } catch (error) {
        console.error(error);
    }
*/

//  Ruta para agregar un producto al carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.post('/carrito/:idUsuario', carritoFunctions.agregarProducto);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a guardar la id de un producto junto con su cantidad relacionada a un usuario. Se envia en el param el id del usuario ye en body
    el id del producto y la cantidad.

    llamada:
    const datos = { idProducto: 5, cantidad: 2 }; // Datos EJEMPLOOOOOO
    
    await fetch(`http://localhost:3000/carrito/${idUsuario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

*/

//  Ruta para modificar un producto en el carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.put('/carrito/:idUsuario/producto/:idProducto', carritoFunctions.modificarProducto);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a modificar un producto que haya sido agregado a el carrito de un usuario en base al id del producto y del usuario.

    llamada:
    const nuevaCantidad = { cantidad: 5 }; // OTRO DATO EJEMPLOOOOO
    
    // Nota cómo la URL incluye ambos IDs
    await fetch(`http://localhost:3000/carrito/${idUsuario}/producto/${idProducto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCantidad)
    });
*/

//  Ruta para eliminar un producto del carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.delete('/carrito/:idUsuario/producto/:idProducto', carritoFunctions.eliminarProducto);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a eliminar un producto que haya sido agregado a el carrito de un usuario en base al id del producto y del usuario.

    llamada:
    // Este NO requiere body, todo va en la URL
    await fetch(`http://localhost:3000/carrito/${idUsuario}/producto/${idProducto}`, {
        method: 'DELETE'
    });
*/

//  Ruta para eliminar todo el carrito de un usuario -----------------------------------------------------------------------------------------------------------------------
router.delete('/carrito/:idUsuario', carritoFunctions.eliminarCarrito);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va eliminar todos los datos de un carrito en especifico

    llamada:
    await fetch(`http://localhost:3000/carrito/${idUsuario}`, {
        method: 'DELETE'
    });
*/


module.exports = router;