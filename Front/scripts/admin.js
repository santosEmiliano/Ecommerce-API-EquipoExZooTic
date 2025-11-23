import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const productosGrid = document.getElementById("products-grid");
  const modal = document.getElementById("info-modal");
  const btnAddProduct = document.getElementById("btn-add-product");

  let productos = [];

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
        const rutaImagen = producto.imagen 
            ? `../Back/media${producto.imagen}` 
            : 'media/logo.png';
        
        html += `
            <div class="card">
                <div class="card-image-container">
                    <img src="${rutaImagen}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
                </div>
                <div class="card-body">
                    <h2>${producto.nombre}</h2>
                    <button type="button" class="btnDetails" data-id="${producto.id}">
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
      const producto = productos.find((p) => p.id == id);

      if (!producto) {
          console.error("Producto no encontrado en memoria local");
          return;
      }

      modal.classList.remove("is-fading-out");
      modal.style.display = "flex";
      mostrarDetalles(producto);
    }
  });

  function mostrarDetalles(producto) {
    const desc = producto.descripcion || "Sin descripción";
    const cat = producto.categoria || "Sin categoría";
    const stock = producto.existencias || 0;
    const descVal = producto.descuento || 0;
    
    const rutaImagen = producto.imagen 
        ? `../Back/media${producto.imagen}` 
        : 'media/logo.png';

    modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header">
                <h3><i class="fa-solid fa-id-card"></i> Ficha del Producto</h3>
                <span class="close" id="closeInfoModal">&times;</span>
            </div>
            
            <div class="modal-body">
                <div class="details-grid">
                    <div class="details-img-container">
                        <img src="${rutaImagen}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
                    </div>
                    <div class="details-info">
                        <h2>${producto.nombre}</h2>
                        <div class="detail-row"><span>ID:</span><strong>#${producto.id}</strong></div>
                        <div class="detail-row"><span>Categoría:</span><strong>${cat}</strong></div>
                        <div class="detail-row"><span>Precio:</span><span class="tag-price">$${producto.precio}</span></div>
                        <div class="detail-row"><span>Descuento:</span><strong>${descVal}%</strong></div>
                        <div class="detail-row"><span>Stock:</span><strong>${stock}</strong></div>
                        <div class="detail-row" style="flex-direction:column; align-items:flex-start;">
                            <span>Descripción:</span>
                            <p style="font-size: 14px; margin-top:5px;">${desc}</p>
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
            <button type="button" id="btnEliminar" class="btn-eliminar">
                <i class="fa-solid fa-trash"></i> Eliminar
            </button>
            <button type="button" id="btnModificar" class="btn-modificar">
                <i class="fa-solid fa-pen"></i> Modificar
            </button>
        `;

        document.getElementById("btnModificar").onclick = () => {
            mostrarEdicion(producto);
        };

        document.getElementById("btnEliminar").onclick = () => {
            mostrarConfirmacion();
        };
    }

    function mostrarConfirmacion() {
        actionsContainer.innerHTML = `
            <span class="text-danger" style="font-weight:bold;">¿Eliminar este producto?</span>
            <button type="button" id="btnCancelarBorrar" class="btn-modificar" style="background:#ccc; color:black;">
                Cancelar
            </button>
            <button type="button" id="btnConfirmarBorrar" class="btn-eliminar">
                ¡Sí, Eliminar!
            </button>
        `;

        document.getElementById("btnCancelarBorrar").onclick = () => {
            restaurarBotones();
        };

        document.getElementById("btnConfirmarBorrar").onclick = async () => {
            await servicios.deleteProd(producto.id);
            alert("Producto eliminado");
            cerrarModalConAnimacion();
            cargarProductos();
        };
    }

    restaurarBotones();
  }

  function mostrarEdicion(producto) {
    const rutaImagen = producto.imagen 
        ? `../Back/media${producto.imagen}` 
        : 'media/logo.png';

    modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header" style="background: var(--color-amarillo); color: black;">
                <h3><i class="fa-solid fa-pen-to-square"></i> Editando: ${producto.nombre}</h3>
                <span class="close" id="closeEditModal" style="color:black;">&times;</span>
            </div>
            
            <div class="modal-body">
                <form id="formEdicion" class="form-alta">
                    
                    <div class="form-group">
                        <label>Imagen del Producto</label>
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <img src="${rutaImagen}" onerror="this.src='media/logo.png'" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc;">
                            <div style="flex: 1;">
                                <label for="nuevaImagen" style="font-size: 12px; color: gray;">Subir nueva imagen (opcional):</label>
                                <input type="file" id="nuevaImagen" accept="image/*" class="input-modal">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="editNombre">Nombre</label>
                        <input type="text" id="editNombre" class="input-modal" value="${producto.nombre}" required>
                    </div>

                    <div class="form-group">
                        <label for="editDescripcion">Descripción</label>
                        <textarea id="editDescripcion" rows="3" class="input-modal" required>${producto.descripcion || ''}</textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">
                            <label for="editPrecio">Precio ($)</label>
                            <input type="number" id="editPrecio" step="0.01" class="input-modal" value="${producto.precio}" required>
                        </div>
                        <div class="form-group">
                            <label for="editDescuento">Descuento (%)</label>
                            <input type="number" id="editDescuento" min="0" max="100" class="input-modal" value="${producto.descuento || 0}" required>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">
                            <label for="editExistencias">Stock</label>
                            <input type="number" id="editExistencias" min="0" class="input-modal" value="${producto.existencias || 0}" required>
                        </div>
                        <div class="form-group">
                            <label for="editCategoria">Categoría</label>
                            <div class="form-group">
                            <select id="editCategoria" style="height: 4.8vh;" class="input-modal" required>
                                <option value="">Selecciona una categoría</option>
                                <option value="patrimoniales">patrimoniales</option>
                                <option value="megafaunas">megafaunas</option>
                                <option value="superpredadores">superpredadores</option>
                            </select>
                        </div>
                        </div>
                    </div>

                </form>
            </div>

            <div class="modal-actions">
                <button type="button" id="btnCancelarEdicion" class="btn-eliminar" style="background-color: #6c757d;">
                    Cancelar
                </button>
                <button type="submit" form="formEdicion" class="btn-modificar" style="background-color: var(--color-verde); color: white;">
                    <i class="fa-solid fa-save"></i> Confirmar
                </button>
            </div>
        </div>
    `;

    document.getElementById("closeEditModal").onclick = cerrarModalConAnimacion;

    document.getElementById("btnCancelarEdicion").onclick = () => {
        mostrarDetalles(producto);
    };

    const form = document.getElementById("formEdicion");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("nombre", document.getElementById("editNombre").value);
        formData.append("descripcion", document.getElementById("editDescripcion").value);
        formData.append("precio", document.getElementById("editPrecio").value);
        formData.append("descuento", document.getElementById("editDescuento").value);
        formData.append("existencias", document.getElementById("editExistencias").value);
        formData.append("categoria", document.getElementById("editCategoria").value);

        const fileInput = document.getElementById("nuevaImagen");
        if (fileInput.files && fileInput.files[0]) {
            formData.append("imagen", fileInput.files[0]);
        }

        await servicios.updateProd(producto.id, formData);

        cerrarModalConAnimacion();
        cargarProductos();
    });
  }

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
                        <input type="text" id="nombre" class="input-modal" placeholder="Ej. Croquetas" required />
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción</label>
                        <textarea id="descripcion" rows="3" class="input-modal" required></textarea>
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
                                <option value="">Selecciona una categoría</option>
                                <option value="patrimoniales">patrimoniales</option>
                                <option value="megafaunas">megafaunas</option>
                                <option value="superpredadores">superpredadores</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn-cancelar" id="btnCancelarAlta">Cancelar</button>
                <button type="submit" id="btn-guardar" form="formAltaModal" class="btn-guardar">
                    <i class="fa-solid fa-save"></i> Guardar
                </button>
            </div>
        </div>`;

    document.getElementById("closeAltaModal").onclick = cerrarModalConAnimacion;
    document.getElementById("btnCancelarAlta").onclick = cerrarModalConAnimacion;

    const form = document.getElementById("formAltaModal");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const formData = new FormData();
      formData.append("nombre", document.getElementById("nombre").value);
      formData.append("categoria", document.getElementById("categoria").value);
      formData.append("descripcion", document.getElementById("descripcion").value);
      formData.append("precio", document.getElementById("precio").value);
      formData.append("existencias", document.getElementById("cantidadAlta").value);
      formData.append("descuento", document.getElementById("descuento").value);

      const inputImagen = document.getElementById("imagen");
      if (inputImagen.files && inputImagen.files[0]) {
        formData.append("imagen", inputImagen.files[0]);
      }

      try {
        const response = await fetch("http://localhost:3000/productos", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Producto guardado");
          cargarProductos();
          cerrarModalConAnimacion();
        } else {
          const res = await response.json();
          alert("Error: " + res.message);
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    });
  });
});