import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const productosGrid = document.getElementById("products-grid");
  const modal = document.getElementById("info-modal");
  const btnAddProduct = document.getElementById("btn-add-product");

  let productos;

  cargarProductos();

  const btnProd = document.getElementById("btnProd");
  if (btnProd) {
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
                    <img src="../Back/media${producto.imagen}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
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

  function cerrarModalConAnimacion() {
    const card = modal.querySelector(".admin-modal-card");
    if (!card) {
      modal.style.display = "none";
      return;
    }

    card.classList.add("is-closing");
    modal.classList.add("is-fading-out");

    setTimeout(() => {
      modal.style.display = "none";
      modal.innerHTML = "";
      modal.classList.remove("is-fading-out");
    }, 250);
  }

  productosGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btnDetails");

    if (btn) {
      const id = btn.dataset.id;
      const producto = productos.find(p => p.id == id);

      if (!producto) return;

      modal.classList.remove("is-fading-out");
      modal.style.display = "flex";

      modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header">
                <h3><i class="fa-solid fa-id-card"></i> Ficha del Producto</h3>
                <span class="close" id="closeInfoModal">&times;</span>
            </div>
            
            <div class="modal-body">
                <div class="details-grid">
                    <div class="details-img-container">
                        <img src="../Back/media/${producto.imagen}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
                    </div>
                    <div class="details-info">
                        <h2>${producto.nombre}</h2>
                        <div class="detail-row"><span>ID:</span><strong>#${producto.id}</strong></div>
                        <div class="detail-row"><span>Categoría:</span><strong>${producto.categoria}</strong></div>
                        <div class="detail-row"><span>Precio:</span><span class="tag-price">$${producto.precio}</span></div>
                        <div class="detail-row"><span>Stock:</span><strong>${producto.existencias}</strong></div>
                        <div class="detail-row" style="flex-direction:column; align-items:flex-start;">
                            <span>Descripción:</span>
                            <p style="font-size: 14px; margin-top:5px;">${producto.descripcion}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions" id="modalActions">
                </div>
        </div>
      `;

      document.getElementById("closeInfoModal").onclick = cerrarModalConAnimacion;

      const actionsContainer = document.getElementById("modalActions");

      function restaurarBotones() {
        actionsContainer.innerHTML = `
            <button id="btnEliminar" class="btn-eliminar">
                <i class="fa-solid fa-trash"></i> Eliminar
            </button>
            <button id="btnModificar" class="btn-modificar" data-id="${id}">
                <i class="fa-solid fa-pen"></i> Modificar
            </button>
        `;

        document.getElementById("btnModificar").onclick = () => {
            console.log("Abriendo formulario para editar ID:", id);
            cerrarModalConAnimacion();
        };

        document.getElementById("btnEliminar").onclick = mostrarConfirmacion;
      }

      function mostrarConfirmacion() {
        actionsContainer.innerHTML = `
            <span class="text-danger" style="font-weight:bold; margin-right:10px;">¿Estás seguro de eliminar esto?</span>
            <button id="btnCancelarBorrar" class="btn-modificar" style="background:#ccc; color:black;">Cancelar</button>
            <button id="btnConfirmarBorrar" class="btn-eliminar">¡Sí, Eliminar!</button>
        `;

        document.getElementById("btnCancelarBorrar").onclick = () => {
            restaurarBotones();
        };

        document.getElementById("btnConfirmarBorrar").onclick = async () => {
             console.log("Eliminando ID:", id);
             cerrarModalConAnimacion();
             cargarProductos();
        };
      }

      restaurarBotones();
    }
  });

  window.onclick = (event) => {
    if (event.target == modal) {
      cerrarModalConAnimacion();
    }
  };

  btnAddProduct.addEventListener("click", (e) => {
    e.preventDefault();

    modal.classList.remove("is-fading-out");

    modal.style.display = "flex";

    modal.innerHTML = `
            <div class="admin-modal-card">
                <div class="modal-header">
                    <h3><i class="fa-solid fa-square-plus"></i> Añadir Nuevo Producto</h3>
                    <span class="close" id="closeAltaModal">&times;</span>
                </div>
                
                <div class="modal-body">
                    <form id="formAltaModal" class="form-alta">
                        <div class="form-group">
                            <label for="imagen">Imagen (URL o Archivo)</label>
                            <input type="file" id="imagen" accept="image/*" class="input-modal" required />
                        </div>

                        <div class="form-group">
                            <label for="nombre">Nombre del producto</label>
                            <input type="text" id="nombre" class="input-modal" placeholder="Ej. Croquetas DogChow" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea id="descripcion" rows="3" class="input-modal" placeholder="Detalles del producto..." required></textarea>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div class="form-group">    
                                <label for="precio">Precio ($)</label>
                                <input type="number" id="precio" step="0.01" class="input-modal" required />
                            </div>
                            <div class="form-group">
                                <label for="descuento">Descuento (%)</label>    
                                <input type="number" id="descuento" min="0" max="100" value="0" class="input-modal" required />
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div class="form-group">
                                <label for="cantidadAlta">Stock Inicial</label>
                                <input type="number" id="cantidadAlta" min="1" value="1" class="input-modal" required />
                            </div>
                            <div class="form-group">
                                <label for="categoria">Categoría</label>
                                <select id="categoria" class="input-modal" required>
                                    <option value="">Selecciona...</option>
                                    <option value="Categoria 1">patrimonales</option>
                                    <option value="Categoria 2">megafaunas</option>
                                    <option value="Categoria 3">superdepredadores</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancelar" id="btnCancelarAlta">Cancelar</button>
                    <button type="submit" id="btn-guardar" form="formAltaModal" class="btn-guardar">
                        <i class="fa-solid fa-save"></i> Guardar Producto
                    </button>
                </div>
            </div>
            `;

    document.getElementById("closeAltaModal").onclick = cerrarModalConAnimacion;
    document.getElementById("btnCancelarAlta").onclick =
      cerrarModalConAnimacion;

    const form = document.getElementById("formAltaModal");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const inputImagen = document.querySelector("#imagen");
      const nombre = document.querySelector("#nombre").value;
      const categoria = document.querySelector("#categoria").value;
      const descripcion = document.querySelector("#descripcion").value;
      const precio = document.querySelector("#precio").value
      const existencias = document.querySelector("#cantidadAlta").value
      const descuento = document.querySelector("#descuento").value

      const formData = new FormData();

      formData.append("nombre", nombre);
      formData.append("categoria", categoria);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("existencias", existencias);
      formData.append("descuento", descuento);

      if (inputImagen.files && inputImagen.files[0]) {
        formData.append("imagen", inputImagen.files[0]);
      }

      try {
        const response = await fetch("http://localhost:3000/productos", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Creado con ID:", result.id);

          cargarProductos(); 
          cerrarModalConAnimacion();
        } else {
          console.error("Error:", result.message);
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
      console.log("Guardando producto nuevo...");

      alert("Producto guardado");
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      cerrarModalConAnimacion();
    }
  });
});
