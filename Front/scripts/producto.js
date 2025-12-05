import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", async () => {
  const idProducto = localStorage.getItem("productoSeleccionado");

  if (!idProducto) {
    Swal.fire({
      title: "¡Ups!",
      text: "No has seleccionado ningún animal.",
      icon: "warning",
      confirmButtonText: "Ir a la tienda",
    }).then(() => {
      window.location.href = "tienda.html";
    });
    return;
  }

  try {
    const producto = await servicios.getProdById(idProducto);

    if (producto) {
      cargarInformacionDOM(producto);

      const inputCantidad = document.getElementById("cantidad");

      inputCantidad.max = producto.existencias;
      inputCantidad.min = 1;

      inputCantidad.addEventListener("input", function () {
        const valorActual = parseInt(this.value);
        const maximo = parseInt(this.max);

        if (valorActual > maximo) {
          this.value = maximo;
          Swal.fire({
            title: "¡Ups!",
            text: `Solo tenemos ${maximo} animalitos disponibles.`,
            icon: "warning",
            confirmButtonText: "Okay",
          });
        }
        if (valorActual < 1) {
          this.value = 1;
        }
      });
      cargarRecomendaciones(producto.id);
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error",
      text: "No pudimos encontrar al animal solicitado.",
      icon: "error",
    }).then(() => {
      window.location.href = "tienda.html";
    });
  }

  initVisualEffects();
});

function cargarInformacionDOM(producto) {
  const titulo = document.querySelector(".titulo-producto");
  const precio = document.querySelector(".precio-actual");
  const descripcion =
    document.querySelector(".descripción") ||
    document.querySelector(".descripcion");
  const imagen = document.getElementById("imgPrincipal");
  const stockBadge = document.querySelector(".disponible");

  if (titulo) titulo.textContent = producto.nombre;
  if (precio) precio.textContent = `$${producto.precio}`;
  if (descripcion) descripcion.textContent = producto.descripcion;

  if (imagen) {
    const rutaImagen =
      producto.imagen && !producto.imagen.startsWith("http")
        ? `http://localhost:3000/images/${producto.imagen}`
        : producto.imagen || "media/logo.png";
    imagen.src = rutaImagen;
    imagen.onerror = () => {
      imagen.src = "media/logo.png";
    };
  }

  if (stockBadge) {
    if (producto.existencias > 0) {
      stockBadge.textContent = `Disponible (Hay ${producto.existencias})`;
      stockBadge.style.background = "var(--color--verde-claro)";
      stockBadge.style.color = "var(--color--verde-bosque)";
      stockBadge.classList.remove("stock-agotado");
    } else {
      stockBadge.textContent = "🚫 AGOTADO TEMPORALMENTE";
      stockBadge.classList.add("stock-agotado");
    }
  }
}

function activarBotonCompra(producto) {
  const btnAgregar = document.querySelector(".boton-comprar");
  const inputCantidad = document.getElementById("input-cantidad-detalle");

  if (btnAgregar) {
    const nuevoBtn = btnAgregar.cloneNode(true);
    btnAgregar.parentNode.replaceChild(nuevoBtn, btnAgregar);

    // --- BLOQUEO SI NO HAY STOCK ---
    if (producto.existencias <= 0) {
      nuevoBtn.disabled = true;
      nuevoBtn.innerHTML = '<i class="fa-solid fa-lock"></i> No disponible';
      nuevoBtn.classList.add("btn-disabled");

      if (inputCantidad) {
        inputCantidad.disabled = true;
        inputCantidad.value = 0;
      }
      return;
    }

    nuevoBtn.addEventListener("click", async () => {
      const userId = localStorage.getItem("idUsuario");
      if (!userId) {
        Swal.fire({
          title: "Identifícate",
          text: "Debes iniciar sesión.",
          icon: "info",
        });
        return;
      }

      const cantidad = inputCantidad ? parseInt(inputCantidad.value) || 1 : 1;

      if (cantidad > producto.existencias) {
        Swal.fire({
          title: "Ups",
          text: "No hay tantos animales disponibles.",
          icon: "warning",
        });
        return;
      }

      try {
        await servicios.agregarAlCarrito(userId, producto.id, cantidad);
        if (typeof Toastify === "function") {
          Toastify({
            text: "¡Añadido a tu mochila!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #7ab24e, #597a4a)",
            },
          }).showToast();
        }
      } catch (error) {
        Swal.fire({ title: "Error", text: error.message, icon: "error" });
      }
    });
  }
}

async function cargarRecomendaciones(idActual) {
  const contenedorRecomendaciones = document.querySelector(".grid-categorias");
  if (!contenedorRecomendaciones) return;

  try {
    const todosLosProductos = await servicios.getProd({});

    const disponibles = todosLosProductos.filter(
      (p) => p.id !== Number(idActual)
    );

    const aleatorios = disponibles.sort(() => 0.5 - Math.random());

    const seleccionados = aleatorios.slice(0, 3);

    contenedorRecomendaciones.innerHTML = "";

    if (seleccionados.length === 0) {
      contenedorRecomendaciones.innerHTML =
        "<p>No hay más especies por explorar.</p>";
      return;
    }

    seleccionados.forEach((prod) => {
      const rutaImg = prod.imagen
        ? `http://localhost:3000${prod.imagen}`
        : "media/logo.png";

      const card = document.createElement("div");
      card.className = "card-categoria";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <div class="img-wrapper">
          <img src="${rutaImg}" alt="${prod.nombre}" onerror="this.src='media/logo.png'">
        </div>
        <div class="contenido-cat">
          <h4>${prod.nombre}</h4>
          <button class="btn-mini-adoptar">
            🍎 Adoptar
          </button>
        </div>
      `;

      card.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        localStorage.setItem("productoSeleccionado", prod.id);

        setTimeout(() => {
          window.location.reload();
        }, 100);
      });

      contenedorRecomendaciones.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando recomendaciones:", error);
    contenedorRecomendaciones.innerHTML = "<p>Error cargando sugerencias.</p>";
  }
}

window.procesarCompra = async (redireccionar = false) => {
  const inputCantidad = document.getElementById("cantidad");
  const idProducto = localStorage.getItem("productoSeleccionado");

  if (!idProducto) {
    mostrarNotificacion(
      "Error: No se ha seleccionado ningún producto.",
      "error"
    );
    return;
  }

  const valorCantidad = parseInt(inputCantidad.value);

  if (isNaN(valorCantidad) || valorCantidad < 1) {
    mostrarNotificacion(
      "Por favor, ingresa una cantidad válida (mínimo 1).",
      "error"
    );
    return;
  }

  if (inputCantidad.max && valorCantidad > parseInt(inputCantidad.max)) {
    mostrarNotificacion(
      `Solo hay ${inputCantidad.max} unidades disponibles.`,
      "error"
    );
    return;
  }

  try {
    if (!localStorage.getItem("token")) {
      mostrarNotificacion(
        "Debes iniciar sesión para añadir al carrito",
        "error"
      );
      return;
    }

    const datosParaEnviar = {
      idProducto: idProducto,
      cantidad: valorCantidad,
    };

    await servicios.addProductoCarrito(datosParaEnviar);

    if (redireccionar) {
      mostrarNotificacion("¡Producto añadido! Redirigiendo...", "success");

      servicios.actualizarCarrito();

      setTimeout(() => {
        window.location.href = "./pagar.html";
      }, 1500);
    } else {
      mostrarNotificacion("¡Producto añadido! ", "success");
      servicios.actualizarCarrito();
    }
  } catch (error) {
    console.error(error);
    mostrarNotificacion(
      error.message || "Hubo un error al procesar la compra.",
      "error"
    );
  }
};

const mostrarNotificacion = (mensaje, tipo) => {
  if (typeof Toastify === "function") {
    const background =
      tipo === "success"
        ? "linear-gradient(to right, #7ab24e, #597a4a)"
        : "linear-gradient(to right, #ff5f6d, #ffc371)";

    Toastify({
      text: mensaje,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: { background: background },
    }).showToast();
  } else {
    Swal.fire({
      title: tipo,
      text: mensaje,
      icon: tipo,
    });
  }
};

function initVisualEffects() {
  const contenedorImg = document.querySelector(".imagen-principal-contenedor");

  if (contenedorImg) {
    contenedorImg.addEventListener("mousemove", (e) => {
      const { offsetWidth: width, offsetHeight: height } = contenedorImg;
      const { offsetX: x, offsetY: y } = e;
      const moveX = (x / width - 0.5) * 20;
      const moveY = (y / height - 0.5) * 20;
      contenedorImg.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) scale(1.02)`;
    });

    contenedorImg.addEventListener("mouseleave", () => {
      contenedorImg.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`;
    });
  }

  setTimeout(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("scroll-show");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const nuevasCards = document.querySelectorAll(
      ".tarjeta-cuidado, .card-categoria"
    );
    nuevasCards.forEach((el) => {
      el.classList.add("scroll-hidden");
      observador.observe(el);
    });
  }, 500);
}
