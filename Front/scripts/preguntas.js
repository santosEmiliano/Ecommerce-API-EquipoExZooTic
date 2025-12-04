document.addEventListener("DOMContentLoaded", () => {
  const preguntas = document.querySelectorAll(".btn-pregunta");

  const ALTURA_MAXIMA = 500;

  preguntas.forEach((pregunta) => {
    pregunta.addEventListener("click", function () {
      this.classList.toggle("activa");

      const respuesta = this.nextElementSibling;

      if (respuesta.style.maxHeight) {
        respuesta.style.maxHeight = null;
        respuesta.style.overflowY = null;
        respuesta.classList.remove("mostrar");
      } else {
        document.querySelectorAll(".respuesta-pregunta").forEach((item) => {
          item.style.maxHeight = null;
          item.style.overflowY = null;
          item.classList.remove("mostrar");
        });

        document.querySelectorAll(".btn-pregunta").forEach((btn) => {
          if (btn !== this) btn.classList.remove("activa");
        });

        respuesta.classList.add("mostrar");

        const alturaTotal = respuesta.scrollHeight + 500;

        if (alturaTotal > ALTURA_MAXIMA) {
          respuesta.style.maxHeight = ALTURA_MAXIMA + "px";
          respuesta.style.overflowY = "auto";
        } else {
          respuesta.style.maxHeight = alturaTotal + "px";
          respuesta.style.overflowY = "hidden";
        }
      }
    });
  });
});
