import servicios from "./servicios.js";
document.addEventListener("DOMContentLoaded", () => {
  const btnSuscripcion = document.getElementById("btn-suscripcion"); // Boton de suscribirse
  const inputEmail = document.getElementById("input-email-suscripcion"); // Input del correo

  if (btnSuscripcion) {
    btnSuscripcion.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = inputEmail.value.trim();

      if (!email) {
        return Swal.fire({
          title: "Escribe tu correo",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: "#4C5F41"
        });
      }

      try {
        const data = await servicios.enviarCorreoSuscripcion(inputEmail.value);

        if (data.status === "success") {
          Swal.fire({
            title: "¡Suscripción exitosa! Revisa tu correo para ver tu cupon.",
            icon: "success",
            confirmButtonText: "Ok",
          });
          inputEmail.value = "";
        } 
      } catch (error) {
        if (error.message === "REQ_LOGIN"){
          Swal.fire({
            title: "Inicia Sesión",
            text: "Necesitas entrar a tu cuenta para recibir regalos exclusivos.",
            icon: "info",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#4C5F41"
          });
        } else if(error.message === "ALREADY_SUB"){
          Swal.fire({
            title: "¡Ya estás con nosotros!",
            text: "Ya eres parte de la manada. No puedes reclamar el cupón dos veces. 😉",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#E67E22"
          });
        } else{
          Swal.fire({
            title: `Error`,
            text: error.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  }
});