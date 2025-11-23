import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const productosGrid = document.getElementById("products-grid");
  let productos;

  cargarProductos();
  
  const btnProd = document.getElementById("btnProd");
  if(btnProd) {
      btnProd.onclick = () => cargarProductos();
  }

  async function cargarProductos() {
    try {
      productos = await servicios.getProd();

      let html = "";

      if (!Array.isArray(productos) || productos.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: gray; padding: 50px;">
                <i class="fa-solid fa-box-open" style="font-size: 50px; margin-bottom: 20px;"></i>
                <h3>No hay productos disponibles</h3>
            </div>`;
        return;
      }

      productos.forEach((producto) => {
        html += `
            <div class="card">
                <div class="card-image-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
                </div>
                <div class="card-body">
                    <h2>${producto.nombre}</h2>
                    <button class="btnDetails" data-id="${producto.id}">
                        <i class="fa-solid fa-eye"></i> Ver Detalles
                    </button>
                </div>
            </div>`;
      });

      productosGrid.innerHTML = html;
    } catch (error) {
      console.error("Hubo un error cargando los productos:", error);
      productosGrid.innerHTML = `<p style="color: red; text-align: center;">Error al cargar productos.</p>`;
    }
  }

  productosGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btnDetails");
    
    if (btn) {
      const id = btn.dataset.id;
      const modal = document.getElementById("info-modal");

      modal.style.display = "flex";

      modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header">
                <h3>Detalles del Producto</h3>
                <span class="close" id="closeInfoModal">&times;</span>
            </div>
            <div class="modal-body">
                <p>Estás editando el producto con ID: <strong>${id}</strong></p>
                <p>Aquí irían los campos del formulario de edición...</p>
            </div>
            <div class="modal-actions">
                <button id="btnEditar" data-id="${id}">
                    <i class="fa-solid fa-pen-to-square"></i> Guardar Cambios
                </button>
            </div>
        </div>
      `;

      document.getElementById("closeInfoModal").onclick = () => {
        modal.style.display = "none";
        modal.innerHTML = "";
      };

      const btnEditar = document.getElementById("btnEditar");
      btnEditar.onclick = () => {
        console.log("Guardando cambios del ID:", id);
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