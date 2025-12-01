import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Verificar si hay un ID guardado
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

  // 2. Cargar datos del servidor
  try {
    const producto = await servicios.getProdById(idProducto);

    if (producto) {
      cargarInformacionDOM(producto);
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

  // Inicializar lógica visual extra (randomizers)
  initRandomizers();
  initVisualEffects();
});

function cargarInformacionDOM(producto) {
  // Referencias a elementos
  const titulo = document.querySelector(".titulo-producto");
  const precio = document.querySelector(".precio-actual");
  const descripcion = document.querySelector(".descripción");
  const imagen = document.getElementById("imgPrincipal");
  const stockBadge = document.querySelector(".disponible");
  const botonComprar = document.querySelector(".boton-comprar");

  // Inyectar datos
  if (titulo) titulo.textContent = producto.nombre;
  if (precio) precio.textContent = `$${producto.precio}`;
  if (descripcion) descripcion.textContent = producto.descripcion;

  if (imagen) {
    const rutaImagen = producto.imagen
      ? `http://localhost:3000${producto.imagen}`
      : "media/imagen_prueba.jpg";
    imagen.src = rutaImagen;
    imagen.onerror = () => {
      imagen.src = "media/logo.png";
    };
  }

  if (stockBadge) {
    if (producto.existencias > 0) {
      stockBadge.textContent = "Disponible para adopción";
      stockBadge.style.background = "var(--color--verde-claro)";
      stockBadge.style.color = "var(--color--verde-bosque)";
    } else {
      stockBadge.textContent = "Ya ha sido adoptado";
      stockBadge.style.background = "#ffcccb";
      stockBadge.style.color = "#d32f2f";
      if (botonComprar) {
        botonComprar.disabled = true;
        botonComprar.textContent = "No disponible";
        botonComprar.style.opacity = "0.5";
        botonComprar.style.cursor = "not-allowed";
      }
    }
  }
}

// Lógica para finalizar compra o agregar al carrito (sin animación de vuelo)
window.agregarAlCarrito = () => {    
    if (typeof Toastify === "function") {
        Toastify({
            text: "¡Añadido al formulario de adopción!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #7ab24e, #597a4a)",
            },
        }).showToast();
    }
};

function initRandomizers() {
  const opcionesEdad = [
    "Cría (3 meses)",
    "Juvenil (6 meses)",
    "Sub-adulto (9 meses)",
    "Adulto (1-2 años)",
    "Adulto Reproductor",
    "Senior (+5 años)",
  ];
  const opcionesSexo = ["Macho", "Hembra", "Sin sexar (Indefinido)"];
  const opcionesAlimentacion = [
    "Insectívoro",
    "Carnívoro",
    "Herbívoro",
    "Omnívoro",
    "Frugívoro",
  ];

  const obtenerAleatorio = (lista) => lista[Math.floor(Math.random() * lista.length)];

  const itemsLista = document.querySelectorAll(".lista-caracteristicas li");
  if (itemsLista.length >= 3) {
    itemsLista[0].innerHTML = `<strong>Edad:</strong> ${obtenerAleatorio(opcionesEdad)}`;
    itemsLista[1].innerHTML = `<strong>Sexo:</strong> ${obtenerAleatorio(opcionesSexo)}`;
    itemsLista[2].innerHTML = `<strong>Alimentación:</strong> ${obtenerAleatorio(opcionesAlimentacion)}`;
  }

  // Cuidados aleatorios
  const textosTemperatura = [
    "Zona caliente (30-32°C) y zona fría (24-26°C).",
    "Temperatura ambiente constante (22-25°C).",
    "Requiere foco de calor a 35°C y UVB.",
    "Humedad alta (80%) y temperatura (26-28°C).",
    "Agua climatizada a 24-26°C.",
  ];
  const textosHabitat = [
    "Mínimo 60x45x30 cm. Sustrato de fibra de coco.",
    "Terrario vertical de malla con ramas.",
    "Acuario de 80 litros con zona seca.",
    "Jaula espaciosa con base sólida.",
    "Tupper o rack con buena ventilación.",
  ];
  const textosDieta = [
    "Grillos, tenebrios y calcio.",
    "Vegetales de hoja verde y fruta.",
    "Ratones descongelados semanalmente.",
    "Pienso especializado y heno.",
    "Pescado de río y pellets.",
  ];

  const tarjetasCuidado = document.querySelectorAll(".tarjeta-cuidado p");
  if (tarjetasCuidado.length >= 3) {
    tarjetasCuidado[0].innerText = obtenerAleatorio(textosTemperatura);
    tarjetasCuidado[1].innerText = obtenerAleatorio(textosHabitat);
    tarjetasCuidado[2].innerText = obtenerAleatorio(textosDieta);
  }
}

function initVisualEffects() {
  // Efecto 3D en la imagen
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

  // Scroll Reveal
  const elementosAnimables = document.querySelectorAll(".tarjeta-cuidado, .card-categoria");
  elementosAnimables.forEach((el) => el.classList.add("scroll-hidden"));

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

  elementosAnimables.forEach((el) => observador.observe(el));
}