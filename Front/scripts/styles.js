const preguntas = document.querySelectorAll(".container-pregunta");

//Sección Main
const ZOOM_SCROLL_RANGE = 1200;
const INITIAL_MASK_SIZE = 600;

const stage = document.getElementById("fixed-stage");
const contentInner = document.getElementById("content-inner");

function updateBodyHeight() {
  const contentHeight = contentInner.offsetHeight;
  document.body.style.height = ZOOM_SCROLL_RANGE + contentHeight + "px";
}

window.addEventListener("load", updateBodyHeight);
window.addEventListener("resize", updateBodyHeight);

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY < ZOOM_SCROLL_RANGE) {
    if (!stage.classList.contains("masked")) {
      stage.classList.add("masked");
      stage.style.maskImage = "";
      stage.style.webkitMaskImage = "";
    }

    const progress = scrollY / ZOOM_SCROLL_RANGE;
    const newSize = INITIAL_MASK_SIZE + Math.pow(progress, 4) * 150000;

    stage.style.webkitMaskSize = `${newSize}px`;
    stage.style.maskSize = `${newSize}px`;

    let newOpacity = progress * 1.5;
    if (newOpacity > 1) newOpacity = 1;

    contentInner.style.opacity = newOpacity;
    stage.style.opacity = 0.7 + newOpacity;

    contentInner.style.transform = `translateY(0px)`;
  } else {
    stage.classList.remove("masked");
    stage.style.webkitMaskSize = "auto";
    stage.style.maskSize = "auto";
    stage.style.maskImage = "none";
    stage.style.webkitMaskImage = "none";

    contentInner.style.opacity = 1;

    const contentScroll = scrollY - ZOOM_SCROLL_RANGE;
    contentInner.style.transform = `translateY(-${contentScroll}px)`;
  }
});

window.dispatchEvent(new Event("scroll"));

//Sección de preguntas
preguntas.forEach((p) => {
  p.querySelector(".btn-pregunta").addEventListener("click", () => {
    p.classList.toggle("activa");
  });
});

//Sección Sobre Nosotros
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
