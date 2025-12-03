//      RUTAS PARA LAS FUNCIONES DE CORREO SUSCRIPCION Y CONTACTO 

//          IMPORTS PROVENIENTES DEL MIDDLEWARE
const tokens = require("../middleware/verifyToken");

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const correoContoller = require('../controllers/correo.controller');

// Imports de express
const express = require ('express');
const router = express.Router();

// Ruta para el correo de la Suscripcion --------------------------------------------------------------------------------------------------
router.post('/suscripcion', tokens.verifyToken, correoContoller.enviarCorreoSub);

/* 
    Esta ruta va a hacer lo siguiente:
     - Obtener el email del usuario cuando se quiera suscribir
     - Seleccionar un cupon de la DB
     - Mandar correo con cupon

    Llamada: 

    Servicios.js:

        const enviarCorreoSuscripcion = async (email) => {
            try{
                const response = await fetch("http://localhost:3000/api/suscripcion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                
                if (!response.ok) {
                    const res = await response.json();
                    throw new Error(res.message || "Error al suscribirse");
                }

                return await response.json();
            } catch (error) {
                console.error("Error al momento de hacer la peticion suscripcion:", error);
                throw error;
            }      
        }

        //AGREGAR EL EXPORT DE LA FUNCION

    Codigo para donde lo vayan a manipular lo de la suscripcion:

        import servicios from "./servicios.js";

        // AQUI PONGAN LOS ID´S QUE MANEJEN
        const btnSuscripcion = document.getElementById("btn-suscripcion"); // Boton de suscribirse
        const inputEmail = document.getElementById("input-email-suscripcion") // Input del correo 

        if (btnSuscripcion) {
            btnSuscripcion.addEventListener("click", async (e) => {
                e.preventDefault();

                if (!inputEmail.value) return alert("Escribe tu correo");

                try {
                    const data = await servicios.enviarCorreoSuscripcion(inputEmail.value);
                        
                    if(data.status === "success") {
                        alert("¡Suscripción exitosa! Revisa tu correo para ver tu cupon.");
                        inputEmail.value = ""; // Limpiar input
                    } else {
                        alert("Error: " + data.message);
                    }
                } catch (error) {
                    alert(error.message);
                }
            });
        }
*/

// Ruta para el correo del Contacto --------------------------------------------------------------------------------------------------
router.post('/contacto', tokens.verifyToken, correoContoller.enviarCorreoContacto);

module.exports = router;
