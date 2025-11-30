//      RUTAS PARA LAS FUNCIONES DE CORREO SUSCRIPCION Y CONTACTO 

//          IMPORTS PROVENIENTES DEL MIDDLEWARE

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const correoContoller = require('../controllers/correo.controller');

// Imports de express
const express = require ('express');
const router = express.Router();

// Ruta para la Suscripcion
router.post('/suscripcion', correoContoller.enviarCorreoSub);

/* 
    Esta ruta va a hacer lo siguiente:
     - Obtener el email del usuario cuando se quiera suscribir
     - Mandar correo con cupon

    Llamada: 

    Servicios.js:

        const enviarSuscripcion = async => {
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
        const inputEmail = document.getElementById("inpum-email-suscripcion") // Input del correo 

        if (btnSuscribir) {
            btnSuscribir.addEventListener("click", async (e) => {
                e.preventDefault();

                if (!inputEmail.value) return alert("Escribe tu correo");

                try {
                    const data = await servicios.enviarSuscripcion(inputEmail.value);
                        
                    if(data.status === "success") {
                        alert("¡Suscripción exitosa! Revisa tu correo por tu regalo.");
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

module.exports = router;