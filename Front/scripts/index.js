//Animación de scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".main-card, .card-certificacion, .comentarios-card")
  .forEach((el) => {
    el.classList.add("hidden", "fade-up");
    observer.observe(el);
  });

document.querySelectorAll(".main-titulo").forEach((el) => {
  el.classList.add("hidden", "fade-right");
  observer.observe(el);
});

document.querySelectorAll(".main-descripcion").forEach((el) => {
  el.classList.add("hidden", "fade-left");
  observer.observe(el);
});

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
