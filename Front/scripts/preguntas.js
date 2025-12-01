//Sección de preguntas
preguntas.forEach((p) => {
  p.querySelector(".btn-pregunta").addEventListener("click", () => {
    p.classList.toggle("activa");
  });
});
