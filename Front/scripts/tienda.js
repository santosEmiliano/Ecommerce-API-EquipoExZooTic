import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-grid");
  const storeWrapper = document.getElementById("store-wrapper");
  const biomeBtns = document.querySelectorAll(".biome-btn");
  const searchInput = document.getElementById("search-input");
  const resetBtn = document.getElementById("reset-filters-btn");
  const priceRange = document.getElementById("price-range");
  const priceDisplay = document.getElementById("price-val");
  const offerCheck = document.getElementById("offer-check");
  const ambientLayer = document.getElementById("ambient-layer");

  if (ambientLayer) {
    document.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;

      const topLeft = ambientLayer.querySelector(".top-left");
      const topRight = ambientLayer.querySelector(".top-right");
      const bottomLeft = ambientLayer.querySelector(".bottom-left");
      const bottomRight = ambientLayer.querySelector(".bottom-right");

      if (topLeft)
        topLeft.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
      if (topRight)
        topRight.style.transform = `scaleX(-1) translate(${moveX}px, ${-moveY}px)`;
      if (bottomLeft)
        bottomLeft.style.transform = `translate(${-moveX}px, ${moveY}px)`;
      if (bottomRight)
        bottomRight.style.transform = `scaleX(-1) translate(${moveX}px, ${moveY}px)`;
    });
  }

  let filtrosActuales = {
    categoria: "patrimoniales",
    precio_max: 5000,
    en_oferta: false,
    search: "",
  };

  const categoryMap = {
    patrimoniales: { css: "card-selva", biome: "selva", icon: "🌿" },
    megafaunas: { css: "card-acuatico", biome: "oceano", icon: "🌊" },
    superdepredadores: { css: "card-desierto", biome: "desierto", icon: "🦁" },
  };

  initStore();

  async function initStore() {
    await aplicarFiltros();
  }

  async function aplicarFiltros() {
    productsContainer.innerHTML = 
      '<div style="position:absolute; left:44vw; top: 18vh; display:flex; flex-direction:column; gap:1vw; justify-content:center; align-items:center;><p style="text-align:center; width:100%; margin-top: 20px;">Cargando...</p> <img src="./media/carnalito.gif" alt=""></div>';

    actualizarInterfaz();

    const queryParams = {
      categoria: filtrosActuales.categoria,
      precio_max: filtrosActuales.precio_max,
      en_oferta: filtrosActuales.en_oferta ? "true" : null,
    };

    try {
      let productos = await servicios.getProd(queryParams);

      if (filtrosActuales.search) {
        productos = productos.filter((p) =>
          p.nombre.toLowerCase().includes(filtrosActuales.search)
        );
      }

      renderProducts(productos);
    } catch (error) {
      console.error("Error cargando tienda:", error);
      productsContainer.innerHTML =
        '<div class="error-msg"><h3>Se perdió la conexión con la naturaleza :(</h3></div>';
    }
  }

  biomeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      biomeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      filtrosActuales.categoria = btn.dataset.cat;

      const biome = btn.dataset.biome;
      storeWrapper.className = `store-wrapper bg-${biome}`;

      aplicarFiltros();
    });
  });

  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      priceDisplay.textContent = e.target.value;
    });

    priceRange.addEventListener("change", (e) => {
      filtrosActuales.precio_max = e.target.value;
      aplicarFiltros();
    });
  }

  if (offerCheck) {
    offerCheck.addEventListener("change", (e) => {
      filtrosActuales.en_oferta = e.target.checked;
      aplicarFiltros();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filtrosActuales.search = e.target.value.toLowerCase();
      aplicarFiltros();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filtrosActuales = {
        categoria: "",
        precio_max: 10000,
        en_oferta: false,
        search: "",
      };

      biomeBtns.forEach((b) => b.classList.remove("active"));

      if (priceRange) {
        priceRange.value = 10000;
        priceDisplay.textContent = 10000;
      }
      if (offerCheck) offerCheck.checked = false;
      if (searchInput) searchInput.value = "";

      storeWrapper.className = "store-wrapper bg-selva";

      aplicarFiltros();
    });
  }

  function renderProducts(products) {
    productsContainer.innerHTML = "";

    if (!products || products.length === 0) {
      productsContainer.innerHTML =
        '<div class="empty-msg"><h3>No hay especies por aquí... 🦗</h3></div>';
      return;
    }

    products.forEach((product, index) => {
      const config = categoryMap[product.categoria] || {
        css: "card-selva",
        icon: "🐾",
      };
      const imgPath = product.imagen
        ? `http://localhost:3000${product.imagen}`
        : "media/logo.png";

      const delay = index < 10 ? index * 0.1 : 0;

      const randomRotate = Math.floor(Math.random() * 6) - 3;

      const cardHTML = `
                <div class="product-card ${config.css}" 
                     style="--texture-rotate: ${randomRotate}deg; animation-delay: ${delay}s;" 
                     onclick="addToCart(${product.id})">
                    
                    <div class="card-tape"></div>
                    
                    <div class="card-image-wrapper">
                        <img src="${imgPath}" alt="${
        product.nombre
      }" class="animal-img" loading="lazy" onerror="this.src='media/logo.png'">
                        <div class="biome-badge">${config.icon}</div>
                    </div>

                    <div class="card-info">
                        <h3 class="animal-name">${product.nombre}</h3>
                        ${
                          product.descuento > 0
                            ? `<div class="offer-badge">-${product.descuento}%</div>`
                            : ""
                        }
                        <div class="price-tag"><span>$${
                          product.precio
                        }</span></div>
                        <button class="btn-feed" onclick="addToCart(${
                          product.id
                        }, event)"> 🍎 <span class="btn-text">Adoptar</span>
                        </button>
                    </div>
                </div>
            `;
      productsContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  function actualizarInterfaz() {
    const hayCategoria = filtrosActuales.categoria !== "";
    const hayPrecio = filtrosActuales.precio_max < 10000;
    const hayOferta = filtrosActuales.en_oferta === true;
    const hayBusqueda = filtrosActuales.search !== "";

    if (hayCategoria || hayPrecio || hayOferta || hayBusqueda) {
      resetBtn.style.display = "flex";
    } else {
      resetBtn.style.display = "none";
    }
  }

  window.addToCart = (id, event) => {
    const btn = event.target.closest("button");
    const card = btn.closest(".product-card");
    const imgOriginal = card.querySelector("img");
    const cartIcon = document.querySelector(".cart-button");

    if (imgOriginal && cartIcon) {
      const flyImg = imgOriginal.cloneNode();
      flyImg.classList.add("flying-img");

      const rectOriginal = imgOriginal.getBoundingClientRect();
      flyImg.style.left = `${rectOriginal.left}px`;
      flyImg.style.top = `${rectOriginal.top}px`;
      flyImg.style.width = `${rectOriginal.width}px`;
      flyImg.style.height = `${rectOriginal.height}px`;

      document.body.appendChild(flyImg);

      const rectCart = cartIcon.getBoundingClientRect();

      setTimeout(() => {
        flyImg.style.left = `${rectCart.left + 10}px`;
        flyImg.style.top = `${rectCart.top + 5}px`;
        flyImg.style.width = "30px";
        flyImg.style.height = "30px";
        flyImg.style.opacity = "0.5";
      }, 10);

      setTimeout(() => {
        flyImg.remove();

        cartIcon.classList.add("jelly-pop");
        setTimeout(() => cartIcon.classList.remove("jelly-pop"), 600);

        if (typeof Toastify === "function") {
          Toastify({
            text: "¡Capturado en la canasta!",
            duration: 2000,
            gravity: "bottom",
            position: "right",
            style: { background: "#4BBEE3" },
          }).showToast();
        }
      }, 800);
    }
  };

  document.addEventListener("click", (e) => {
    const targetBtn = e.target.closest("button");

    if (targetBtn && !targetBtn.classList.contains("jelly-pop")) {
      targetBtn.classList.add("jelly-pop");

      setTimeout(() => {
        targetBtn.classList.remove("jelly-pop");
      }, 600);
    }
  });
});