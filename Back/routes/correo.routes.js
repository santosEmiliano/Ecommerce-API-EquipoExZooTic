//      RUTAS PARA LAS FUNCIONES DE CORREO SUSCRIPCION Y CONTACTO 

//          IMPORTS PROVENIENTES DEL MIDDLEWARE

//          IMPORTS QUE PROVIENEN DEL CONTROLLER
const correoContoller = require('../controllers/correo.controller');

// Imports de express
const express = require ('express');
const router = express.Router();

// Ruta para el correo de la Suscripcion --------------------------------------------------------------------------------------------------
router.post('/suscripcion', correoContoller.enviarCorreoSub);

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
router.post('/contacto', correoContoller.enviarCorreoContacto);

/*
    Esta ruta va a hacer lo siguiente:
     - Obtiene los datos que envia el usuario
     - Manda correo de que sera atendido 
    
    Llamada:

    Servicios.js:
        const enviarCorreoContacto = async (formData) =>{
            try {
                // formData es un objeto JSON { nombre, email, mensaje }
                const response = await fetch("http://localhost:3000/api/contacto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) {
                    const res = await response.json();
                    throw new Error(res.message || "Error al enviar mensaje");
                }
                return await response.json();
            } catch (error) {
                console.error("Error al momento de hacer la peticion contacto:", error);
                throw error;
            }
        };

        //AGREGAR EL EXPORT DE LA FUNCION
    
    Codigo para donde lo vayan a manipular lo del contacto:

        import servicios from "./servicios.js";

        const formContacto = document.getElementById("formularioContacto");

        if (formContacto) {
            formContacto.addEventListener("submit", async (e) => {
                e.preventDefault();
                
                const datos = {
                    nombre: document.getElementById("nombre").value,
                    email: document.getElementById("correo").value,
                    mensaje: document.getElementById("comentario").value
                };

                try {
                    const data = await servicios.enviarCorreoContacto(datos);
                    
                    if(data.status === "success") {
                        alert("Mensaje enviado correctamente. Te contactaremos pronto.");
                        formContacto.reset(); // Limpiar formulario
                    }
                } catch (error) {
                    alert(error.message);
                }
            });
        }



*/

module.exports = router;

//      --------------------------------------------------------------------- N O T A S -----------------------------------------------------------------

// - Las funciones son largas y requieren varias cosas, asi que cualquier duda estoy a sus ordenes