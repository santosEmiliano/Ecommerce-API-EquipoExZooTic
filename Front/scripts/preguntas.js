document.addEventListener("DOMContentLoaded", () => {
  const preguntas = document.querySelectorAll(".container-pregunta");

  preguntas.forEach((pregunta) => {
    const btn = pregunta.querySelector(".btn-pregunta");
    const resp = pregunta.querySelector(".respuesta-pregunta");

    btn.addEventListener("click", () => {
      const estabaAbierta = pregunta.classList.contains("active");

      preguntas.forEach((p) => {
        p.classList.remove("active");
        p.querySelector(".respuesta-pregunta").classList.remove("respuesta-activa");
      });

      if (!estabaAbierta) {
        pregunta.classList.add("active");
        resp.classList.add("respuesta-activa");

        setTimeout(() => {
          pregunta.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      }
    });
  });

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  preguntas.forEach((pregunta) => {
    observer.observe(pregunta);
  });
});
