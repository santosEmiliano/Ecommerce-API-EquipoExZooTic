// Script simple para galería de productos
const mainImg = document.getElementById("imgPrincipal");
const thumbs = document.querySelectorAll(".img-miniatura");

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", function () {
    // Cambiar la imagen principal
    mainImg.src = this.src;

    // Quitar clase activa a todas y ponerla a la actual
    thumbs.forEach((t) => t.classList.remove("activa"));
    this.classList.add("activa");
  });
});

/* Para randomizar los datos en la vista*/
document.addEventListener("DOMContentLoaded", () => {
  const opcionesEdad = [
    "Cría (3 meses)",
    "Juvenil (6 meses)",
    "Sub-adulto (9 meses)",
    "Adulto (1-2 años)",
    "Adulto Reproductor",
    "Senior (+5 años)",
  ];

  const opcionesSexo = ["Macho", "Hembra", "Sin sexar (Indefinido"];

  const opcionesAlimentacion = [
    "Insectívoro",
    "Carnívoro",
    "Herbívoro",
    "Omnívoro",
    "Frugívoro",
  ];

  const obtenerAleatorio = (lista) => {
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
  };

  const itemsLista = document.querySelectorAll(".lista-caracteristicas li");

  if (itemsLista.length >= 3) {
    itemsLista[0].innerHTML = `<strong>Edad:</strong> ${obtenerAleatorio(
      opcionesEdad
    )}`;
    itemsLista[1].innerHTML = `<strong>Sexo:</strong> ${obtenerAleatorio(
      opcionesSexo
    )}`;
    itemsLista[2].innerHTML = `<strong>Alimentación:</strong> ${obtenerAleatorio(
      opcionesAlimentacion
    )}`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const textosTemperatura = [
    "Zona caliente (30-32°C) y zona fría (24-26°C) con termostato.",
    "Temperatura ambiente constante (22-25°C). Evitar corrientes de aire.",
    "Requiere foco de calor (basking spot) a 35°C y UVB 5.0.",
    "Humedad alta (80%) y temperatura tropical (26-28°C).",
    "Agua climatizada a 24-26°C con calentador sumergible.",
  ];

  const textosHabitat = [
    "Mínimo 60x45x30 cm. Sustrato de papel o fibra de coco.",
    "Terrario vertical de malla (40x40x60) con muchas ramas.",
    "Acuario de 80 litros con zona seca y filtro potente.",
    "Jaula espaciosa con base sólida y viruta de álamo.",
    "Tupper o rack con ventilación lateral y papel periódico.",
  ];

  const textosDietaDetallada = [
    "Grillos, tenebrios y suplemento de calcio con D3 (3 veces/sem).",
    "Vegetales de hoja verde (rúcula, canónigos) y fruta ocasional.",
    "Ratones descongelados (pinkies) cada 5-7 días.",
    "Pienso especializado, heno de timothy ilimitado y agua fresca.",
    "Pescado de río, camarones secos y pellets flotantes.",
  ];
  const tarjetasCuidado = document.querySelectorAll(".tarjeta-cuidado p");
  if (tarjetasCuidado.length >= 3) {
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    tarjetasCuidado[0].innerText = getRandom(textosTemperatura);
    tarjetasCuidado[1].innerText = getRandom(textosHabitat);
    tarjetasCuidado[2].innerText = getRandom(textosDietaDetallada);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const elementosAnimables = document.querySelectorAll(
    ".tarjeta-cuidado, .card-categoria"
  );
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
    {
      threshold: 0.1,
    }
  );

  elementosAnimables.forEach((el) => observador.observe(el));

  const contenedorImg = document.querySelector(".imagen-principal-contenedor");
  const imagen = document.querySelector(".imagen-grande");

  if (contenedorImg && imagen) {
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

  const btnComprar = document.querySelector(".boton-comprar");
  const iconoCarrito = document.querySelector(".boton-carrito");

  if (btnComprar && iconoCarrito) {
    btnComprar.addEventListener("click", (e) => {
      e.preventDefault();

      const imgOriginal = document.getElementById("imgPrincipal");
      if (!imgOriginal) return;

      const imgClone = imgOriginal.cloneNode(true);

      const rectImg = imgOriginal.getBoundingClientRect();
      const rectCart = iconoCarrito.getBoundingClientRect();

      imgClone.classList.add("fly-item");
      imgClone.style.top = `${rectImg.top}px`;
      imgClone.style.left = `${rectImg.left}px`;
      imgClone.style.width = `${rectImg.width}px`;
      imgClone.style.height = `${rectImg.height}px`;

      document.body.appendChild(imgClone);

      void imgClone.offsetWidth;

      imgClone.style.top = `${rectCart.top + 10}px`;
      imgClone.style.left = `${rectCart.left + 10}px`;
      imgClone.style.width = "30px";
      imgClone.style.height = "30px";
      imgClone.style.opacity = "0.5";

      setTimeout(() => {
        imgClone.remove();

        iconoCarrito.style.transform = "scale(1.4)";
        setTimeout(() => {
          iconoCarrito.style.transform = "scale(1)";
        }, 200);

        // Aquí podrías llamar a tu función real de agregar al carrito
        // agregarAlCarrito
        //PARA QUE JALE EL CARRITO ES AQUÍ
        if (typeof Toastify === "function") {
          Toastify({
            text: "¡Agregado al carrito!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #7ab24e, #597a4a)",
            },
          }).showToast();
        }
      }, 800);
    });
  }
});
