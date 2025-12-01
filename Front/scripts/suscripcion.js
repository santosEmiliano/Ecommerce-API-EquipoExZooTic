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