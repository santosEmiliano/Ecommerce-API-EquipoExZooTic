import servicios from "./servicios.js";

const formContacto = document.getElementById("formularioContacto");

if (formContacto) {
    formContacto.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value, 
            mensaje: document.getElementById("comentario").value
        };

        try {
            const data = await servicios.enviarCorreoContacto(datos);

            if (data.status === "success") {
                alert("Mensaje enviado correctamente. Te contactaremos pronto.");
                formContacto.reset();
            }
        } catch (error) {
            alert(error.message);
        }
    });
}
