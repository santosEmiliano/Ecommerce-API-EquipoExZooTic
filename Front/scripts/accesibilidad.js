document.addEventListener("DOMContentLoaded", () => {
  const widgetDiv = document.createElement("div");
  widgetDiv.id = "widget-acc-container";
  widgetDiv.innerHTML = `
        <div id="menu-acc" class="menu-acc">
            <div class="item-acc">
                <span>Modo Oscuro</span>
                <label class="switch">
                    <input type="checkbox" id="toggle-dark">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="item-acc">
                <span>Tamaño Letra</span>
                <div style="display: flex; gap: 5px;">
                    <button id="btn-dec-font" class="btn-font-control">-</button>
                    <button id="btn-reset-font" class="btn-font-control" style="width: auto; padding: 0 10px;">Reset</button>
                    <button id="btn-inc-font" class="btn-font-control">+</button>
                </div>
            </div>
        </div>
        <button id="btn-acc-toggle" class="btn-flotante" title="Accesibilidad">
            <i class="fa-solid fa-universal-access"></i>
        </button>
    `;
  document.body.appendChild(widgetDiv);

  const btnToggle = document.getElementById("btn-acc-toggle");
  const menu = document.getElementById("menu-acc");
  const checkDark = document.getElementById("toggle-dark");
  const btnInc = document.getElementById("btn-inc-font");
  const btnDec = document.getElementById("btn-dec-font");
  const btnReset = document.getElementById("btn-reset-font");

  btnToggle.addEventListener("click", () => {
    menu.classList.toggle("mostrar");
  });

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    checkDark.checked = true;
  }

  checkDark.addEventListener("change", () => {
    if (checkDark.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });

  const textTags =
    "h1, h2, h3, h4, h5, h6, p, span, a, li, button, input, label, td, th, blockquote";
  let elements = document.querySelectorAll(textTags);
  let currentZoom = parseFloat(localStorage.getItem("zoomLevel")) || 1;

  function initOriginalSizes() {
    elements.forEach((el) => {
      if (!el.dataset.originalSize) {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);

        if (fontSize > 0) {
          el.dataset.originalSize = fontSize;
        }
      }
    });
  }

  function applyZoom(factor) {
    elements.forEach((el) => {
      const originalSize = parseFloat(el.dataset.originalSize);
      if (originalSize) {
        const newSize = originalSize * factor;
        el.style.fontSize = `${newSize}px`;
      }
    });
    localStorage.setItem("zoomLevel", factor);
  }

  initOriginalSizes();

  if (currentZoom !== 1) {
    applyZoom(currentZoom);
  }

  btnInc.addEventListener("click", () => {
    if (currentZoom < 1.5) {
      currentZoom += 0.1;
      applyZoom(currentZoom);
    }
  });

  btnDec.addEventListener("click", () => {
    if (currentZoom > 0.7) {
      currentZoom -= 0.1;
      applyZoom(currentZoom);
    }
  });

  btnReset.addEventListener("click", () => {
    currentZoom = 1;
    applyZoom(currentZoom);
    elements.forEach((el) => (el.style.fontSize = ""));
  });
});
