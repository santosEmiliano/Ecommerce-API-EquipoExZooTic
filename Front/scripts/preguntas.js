document.addEventListener("DOMContentLoaded", () => {
  const preguntas = document.querySelectorAll(".btn-pregunta");

  preguntas.forEach((pregunta) => {
    pregunta.addEventListener("click", function () {
      this.classList.toggle("activa");

      const respuesta = this.nextElementSibling;

      if (respuesta.style.maxHeight) {
        respuesta.style.maxHeight = null;
        respuesta.classList.remove("mostrar");
      } else {
        document.querySelectorAll(".respuesta-pregunta").forEach((item) => {
          item.style.maxHeight = null;
          item.classList.remove("mostrar");
        });
        document.querySelectorAll(".btn-pregunta").forEach((btn) => {
          if (btn !== this) btn.classList.remove("activa");
        });

        respuesta.classList.add("mostrar");
        respuesta.style.maxHeight = respuesta.scrollHeight + 60 + "px";
      }
    });
  });
});
