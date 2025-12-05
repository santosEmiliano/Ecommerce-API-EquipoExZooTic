document.addEventListener("DOMContentLoaded", async () => {
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
                      <button id="btn-reset-font" class="btn-font-control">Reset</button>
                      <button id="btn-inc-font" class="btn-font-control">+</button>
                  </div>
              </div>
          </div>
          <button id="btn-acc-toggle" class="btn-flotante"><i class="fa-solid fa-universal-access"></i></button>
      `;
  document.body.appendChild(widgetDiv);

  const btnToggle = document.getElementById("btn-acc-toggle");
  const menu = document.getElementById("menu-acc");
  const checkDark = document.getElementById("toggle-dark");
  const btnInc = document.getElementById("btn-inc-font");
  const btnDec = document.getElementById("btn-dec-font");
  const btnReset = document.getElementById("btn-reset-font");

  const textTags =
    "h1, h2, h3, h4, h5, h6, p, span, a, li, button, input, label, td, th";
  let elements = document.querySelectorAll(textTags);
  let currentZoom = 1;

  async function sincronizarPreferencias() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(
          "/back/auth/obtenerDatos",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            if (data.user.tema_pref) {
              localStorage.setItem("theme", data.user.tema_pref);
            }
            if (data.user.zoom_pref) {
              localStorage.setItem("zoomLevel", data.user.zoom_pref);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error conectando con preferencias:", error);
      }
    }

    const temaFinal = localStorage.getItem("theme") || "light";
    const zoomFinal = parseFloat(localStorage.getItem("zoomLevel")) || 1;

    aplicarTema(temaFinal);
    aplicarZoom(zoomFinal);
  }

  async function guardarCambio(tipo, valor) {
    if (tipo === "theme") localStorage.setItem("theme", valor);
    if (tipo === "zoom") localStorage.setItem("zoomLevel", valor);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/back/auth/guardar-preferencias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tema: localStorage.getItem("theme"),
            zoom: localStorage.getItem("zoomLevel"),
          }),
        });
      } catch (error) {
        console.error("Error guardando:", error);
      }
    }
  }

  function aplicarTema(tema) {
    if (tema === "dark") {
      document.body.classList.add("dark-mode");
      checkDark.checked = true;
    } else {
      document.body.classList.remove("dark-mode");
      checkDark.checked = false;
    }
  }

  function initOriginalSizes() {
    elements.forEach((el) => {
      if (!el.dataset.originalSize) {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize > 0) el.dataset.originalSize = fontSize;
      }
    });
  }

  function aplicarZoom(factor) {
    currentZoom = factor;
    elements.forEach((el) => {
      const originalSize = parseFloat(el.dataset.originalSize);
      if (originalSize) {
        el.style.fontSize = `${originalSize * factor}px`;
      }
    });
  }

  btnToggle.addEventListener("click", () => menu.classList.toggle("mostrar"));

  checkDark.addEventListener("change", () => {
    const nuevoTema = checkDark.checked ? "dark" : "light";
    aplicarTema(nuevoTema);
    guardarCambio("theme", nuevoTema);
  });

  btnInc.addEventListener("click", () => {
    if (currentZoom < 1.5) {
      let nuevoZoom = parseFloat((currentZoom + 0.1).toFixed(1));
      aplicarZoom(nuevoZoom);
      guardarCambio("zoom", nuevoZoom);
    }
  });

  btnDec.addEventListener("click", () => {
    if (currentZoom > 0.7) {
      let nuevoZoom = parseFloat((currentZoom - 0.1).toFixed(1));
      aplicarZoom(nuevoZoom);
      guardarCambio("zoom", nuevoZoom);
    }
  });

  btnReset.addEventListener("click", () => {
    aplicarZoom(1);
    guardarCambio("zoom", 1);
  });

  initOriginalSizes();
  await sincronizarPreferencias();

  initOriginalSizes();
  await sincronizarPreferencias();

  window.addEventListener("login-exitoso", async () => {
    await sincronizarPreferencias();
  });
});
