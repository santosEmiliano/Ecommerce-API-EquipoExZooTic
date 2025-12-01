import servicios from "./servicios.js";

const formContacto = document.getElementById("formularioContacto");

if (formContacto) {
  formContacto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById("nombre").value,
      email: document.getElementById("email").value,
      mensaje: document.getElementById("comentario").value,
    };

    try {
      const data = await servicios.enviarCorreoContacto(datos);

      if (data.status === "success") {
        Swal.fire({
          title: `Mensaje enviado correctamente. Te contactaremos pronto.`,
          icon: "success",
          confirmButtonText: "Ok",
        });
        formContacto.reset();
      }
    } catch (error) {
      Swal.fire({
        title: `Error: ${error.message}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  });
}
