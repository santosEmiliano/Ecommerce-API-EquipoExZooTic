const preguntas = document.querySelectorAll(".btn-pregunta");

preguntas.forEach((btn) => {
  btn.addEventListener("click", () => {
    const respuesta = btn.nextElementSibling;

    if (respuesta.style.maxHeight) {
      respuesta.style.maxHeight = null;
    } else {
      respuesta.style.maxHeight = respuesta.scrollHeight + "px";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".reveal");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  }, observerOptions);

  items.forEach((item) => {
    observer.observe(item);
  });

  const timelineSection = document.querySelector(".timeline-section");
  const timelineFill = document.querySelector(".timeline-fill");

  function updateTimelineFill() {
    if (!timelineSection || !timelineFill) return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const sectionTop = timelineSection.offsetTop;
    const sectionHeight = timelineSection.offsetHeight;
    const startPoint = sectionTop - viewportHeight / 2;
    let pixelsScrolled = scrollTop - startPoint;
    let totalScrollableDistance = sectionHeight - viewportHeight / 2;
    let percent = (pixelsScrolled / totalScrollableDistance) * 100;
    percent = Math.min(100, Math.max(0, percent));
    timelineFill.style.height = percent + "%";
  }
  window.addEventListener("scroll", updateTimelineFill);
  updateTimelineFill();
});
