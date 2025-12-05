import servicios from "./servicios.js";
import style from "./styles.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnSuscripcion = document.getElementById("btn-suscripcion"); // Boton de suscribirse
  const inputEmail = document.getElementById("input-email-suscripcion"); // Input del correo

  if (btnSuscripcion) {
    btnSuscripcion.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = inputEmail.value.trim();

      if (!email) {
        style.toast("Escribe tu correo", "#c7e86a");
      }

      try {
        const data = await servicios.enviarCorreoSuscripcion(inputEmail.value);

        if (data.status === "success") {
          style.toast("¡Suscripción exitosa! Revisa tu correo para ver tu cupon.", "#7ab24e");
        
          inputEmail.value = "";
        } 
      } catch (error) {
        if (error.message === "REQ_LOGIN"){
          style.toast("INICIA SESIÓN, Necesitas entrar a tu cuenta para recibir regalos exclusivos.", "#f3e57c");
        } else if(error.message === "ALREADY_SUB"){
          style.toast("¡Ya estás con nosotros!, Ya eres parte de la manada. No puedes reclamar el cupón dos veces. 😉", "#E67E22");
        } else{
          style.toast(`Error: ${error.message}`, "#FF0000");
        }
      }
    });
  }
});