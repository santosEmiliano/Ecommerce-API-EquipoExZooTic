//      RUTAS PARA LAS FUNCIONES DE COMPRA (Obtener datos de compra, confirmar compra)

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const compraFunctions = require('../controllers/compra.controller');

//Imports de express
const express = require("express");
const router = express.Router();

//  Ruta para obtener enviar los datos de la compra al front -----------------------------------------------------------------------------------------------------------------------
router.get('/compra/:id', tokens.verifyToken ,compraFunctions.obtenerResumenCompra);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a enviar los datos de como se va a manejar el dinero a la parte del front, para encontrar al usuario supongo que seria mediante su id

    llamada:

    try {
        const response = await fetch(`http://localhost:3000/compra/{id}`);
        
        if (response.status === 404) {
            alert("Producto no encontrado");
            return;
        }
        const data = await response.json();
    } catch (error) {
        console.error(error);
    }
*/


//  Ruta para confirmar la compra -----------------------------------------------------------------------------------------------------------------------
router.post('/compra/:id', tokens.verifyToken ,compraFunctions.confirmarCompra);

//Descripcion del funcionamiento y llamada
/*
    Esta ruta va a recibir todos los datos del front para:

    - Confirmar la compra y guardar el pago en la tabla de ventas
    - Vaciar el carrito de compras una vez guardados los pagos
    - Obtener todos los datos del front para enviar el correo (Esta parte la checa Harim)

    Al igual que arriba, se envia la id del usuario para obtener el carrito, aparte de todos los datos

    llamada: (De momento esta checada con chat en lo que acabo lo demas y la verifico bien)
        // Función que se ejecuta al dar click en "FINALIZAR Y PAGAR"
        async function finalizarCompra() {
            // 1. Recolectar datos del formulario HTML
            // Asegúrate de que tus inputs tengan estos IDs o names
            const datosEnvio = {
                nombre: document.getElementById('nombre').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                
                // El valor del select debe ser el código del país (ej: "MX", "AR")
                pais: document.getElementById('pais-select').value, 
                
                // Obtener cuál radio button está seleccionado
                metodoPago: document.querySelector('input[name="metodo_pago"]:checked').value, 

                //ESTE DE AQUI ES IMPORTANTE
                email: document.querySelector('correo')
            };

            const usuarioId = 1; // Obtener esto de tu sesión o localStorage

            try {
                // 2. Realizar la petición POST
                const response = await fetch(`http://localhost:3000/compra/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // ¡Muy importante!
                    },
                    body: JSON.stringify(datosEnvio) // Convertimos el objeto a texto para enviarlo
                });

                const data = await response.json();

                // 3. Manejar la respuesta
                if (response.ok) {
                    alert("¡Compra exitosa! ID de pedido: " + data.id_venta);
                    // Redirigir a página de agradecimiento
                    window.location.href = "/gracias.html";
                } else {
                    alert("Error: " + data.message);
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                alert("No se pudo conectar con el servidor.");
            }
        }
*/

module.exports = router;