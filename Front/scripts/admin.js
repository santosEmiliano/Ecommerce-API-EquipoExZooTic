import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const productosGrid = document.getElementById("products-grid");
  let productos;

  cargarProductos();
  document.getElementById("btnProd").onclick = () => {
    cargarProductos();
  };

  async function cargarProductos() {
    try {
      productos = await servicios.getProd();

      let html = "";

      if (!Array.isArray(productos) || productos.length === 0) {
        console.log("No hay productos o el formato es incorrecto");
        return;
      }

      productos.forEach((producto) => {
        html += `
                <div class="card">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h2>${producto.nombre}</h2>
                    <button class="btnDetails" data-id="${producto.id}">Ver Detalles</button>
                </div>`;
      });

      productosGrid.innerHTML = html;
    } catch (error) {
      console.error("Hubo un error cargando los productos:", error);
    }
  }

  productosGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnDetails")) {
      const id = e.target.dataset.id;
      const modal = document.getElementById("info-modal");

      modal.style.display = "flex";

      modal.innerHTML = `
        <div class="admin-modal-card"> <span class="close" id="closeInfoModal">&times;</span>
            <h2>Detalles del Producto</h2>
            <p>Estás viendo el producto con ID: <strong>${id}</strong></p>
            <div class="modal-actions">
                <button id="btnEditar" data-id="${id}">Editar este producto</button>
            </div>
        </div>
      `;

      document.getElementById("closeInfoModal").onclick = () => {
        modal.style.display = "none";
        modal.innerHTML = "";
      };

      const btnEditar = document.getElementById("btnEditar");
      btnEditar.onclick = () => {
        console.log("Ir a la pantalla de edición del ID:", id);
        modal.style.display = "none";
        modal.innerHTML = "";
      };
    }
  });

  window.onclick = (event) => {
    const modal = document.getElementById("info-modal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
