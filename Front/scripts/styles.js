const preguntas = document.querySelectorAll(".container-pregunta");

preguntas.forEach((p) => {
  p.querySelector(".btn-pregunta").addEventListener("click", () => {
    p.classList.toggle("activa");
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

//Alert diseño
function toast(msg, color) {
  Toastify({
    text: msg,
    duration: 3800,
    gravity: "top",
    position: "right",
    close: true,
    stopOnFocus: true,
    offset: {
      x: 25,
      y: 80,
    },
    style: {
      background: `${color}`,
      border: "0.5vh solid #4C5F41",
      borderRadius: "1.8vh",
      padding: "2.2vh 3vh",
      fontSize: "2.4vh",
      fontWeight: "600",
      minWidth: "32vh",
      maxWidth: "46vh",
      color: "#000000",
      textAlign: "center",
      boxShadow: "0 0.8vh 1.6vh rgba(0,0,0,0.35)",
    },
  }).showToast();
}
