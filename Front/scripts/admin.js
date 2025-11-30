import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const productosGrid = document.getElementById("products-grid");
  const modal = document.getElementById("info-modal");
  const btnAddProduct = document.getElementById("btn-add-product");
  
  const btnProd = document.getElementById("btnProd");
  const submenu = document.getElementById("submenu-filtros");
  const rangeInput = document.getElementById("filtro-precio");
  const priceVal = document.getElementById("price-val");
  const btnAplicar = document.getElementById("btn-aplicar-filtros");

  let productos = [];

  cargarProductos();

  if (btnProd) {
    btnProd.onclick = () => submenu.classList.toggle("open");
  }

  rangeInput.addEventListener("input", (e) => {
      priceVal.textContent = e.target.value;
  });

  btnAplicar.addEventListener("click", () => {
      const categoria = document.getElementById("filtro-categoria").value;
      const precioVal = document.getElementById("filtro-precio").value;
      const oferta = document.getElementById("filtro-oferta").checked;

      let precioMaxToSend;

      if (oferta) {
          precioMaxToSend = null; 
      } else {
          precioMaxToSend = precioVal === "10000" ? null : precioVal;
      }

      const filtros = {
          categoria: categoria,
          precio_max: precioMaxToSend,
          en_oferta: oferta ? "true" : null
      };

      cargarProductos(filtros);
  });

  async function cargarProductos(filtros = {}) {
    try {
      productosGrid.innerHTML = 
      '<div style="position:absolute; left:55vw; top: 50vh; display:flex; flex-direction:column; gap:1vw; justify-content:center; align-items:center;><p style="text-align:center; width:100%; margin-top: 20px;">Cargando...</p> <img src="./media/carnalito.gif" alt=""></div>';
      productos = await servicios.getProd(filtros);
      
      let html = "";

      if (!Array.isArray(productos) || productos.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: gray; padding: 50px;">
                <i class="fa-solid fa-box-open" style="font-size: 50px; margin-bottom: 20px;"></i>
                <h3>No se encontraron productos</h3>
            </div>`;
        return;
      }

      productos.forEach((producto) => {
        const imgPath = producto.imagen ? `http://localhost:3000${producto.imagen}` : 'media/logo.png';
        
        html += `
            <div class="card">
                <div class="card-image-container">
                    <img src="${imgPath}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
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
    if (!card) { modal.style.display = "none"; return; }

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
      if (producto) {
          modal.classList.remove("is-fading-out");
          modal.style.display = "flex";
          mostrarDetalles(producto);
      }
    }
  });

  function mostrarDetalles(producto) {
    const imgPath = producto.imagen ? `http://localhost:3000${producto.imagen}` : 'media/logo.png';

    modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header">
                <h3><i class="fa-solid fa-id-card"></i> Ficha del Producto</h3>
                <span class="close" id="closeInfoModal">&times;</span>
            </div>
            
            <div class="modal-body">
                <div class="details-grid">
                    <div class="details-img-container">
                        <img src="${imgPath}" alt="${producto.nombre}" onerror="this.src='media/logo.png'">
                    </div>
                    <div class="details-info">
                        <h2>${producto.nombre}</h2>
                        <div class="detail-row"><span>ID:</span><strong>#${producto.id}</strong></div>
                        <div class="detail-row"><span>Categoría:</span><strong>${producto.categoria}</strong></div>
                        <div class="detail-row"><span>Precio:</span><span class="tag-price">$${producto.precio}</span></div>
                        <div class="detail-row"><span>Descuento:</span><strong>${producto.descuento}%</strong></div>
                        <div class="detail-row"><span>Stock:</span><strong>${producto.existencias}</strong></div>
                        <div class="detail-row" style="flex-direction:column; align-items:flex-start;">
                            <span>Descripción:</span>
                            <p style="font-size: 14px; margin-top:5px;">${producto.descripcion}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-actions" id="modalActions"></div>
        </div>
    `;

    document.getElementById("closeInfoModal").onclick = cerrarModalConAnimacion;
    const actionsContainer = document.getElementById("modalActions");

    function restaurarBotones() {
        actionsContainer.innerHTML = `
            <button type="button" id="btnEliminar" class="btn-eliminar"><i class="fa-solid fa-trash"></i> Eliminar</button>
            <button type="button" id="btnModificar" class="btn-modificar"><i class="fa-solid fa-pen"></i> Modificar</button>
        `;
        document.getElementById("btnModificar").onclick = () => mostrarEdicion(producto);
        document.getElementById("btnEliminar").onclick = mostrarConfirmacion;
    }

    function mostrarConfirmacion() {
        actionsContainer.innerHTML = `
            <span class="text-danger" style="font-weight:bold; display:flex; align-items:center;">¿Eliminar definitivamente?</span>
            <button type="button" id="btnCancelarBorrar" class="btn-modificar" style="background:#ccc; color:black;">Cancelar</button>
            <button type="button" id="btnConfirmarBorrar" class="btn-eliminar">¡Sí, Eliminar!</button>
        `;
        
        document.getElementById("btnCancelarBorrar").onclick = restaurarBotones;

        document.getElementById("btnConfirmarBorrar").onclick = async () => {
            try {
                await servicios.deleteProd(producto.id);
                alert("Producto eliminado");
                cerrarModalConAnimacion();
                cargarProductos();
            } catch (err) {
                alert(err.message);
            }
        };
    }

    restaurarBotones();
  }

  function mostrarEdicion(producto) {
    const imgPath = producto.imagen ? `http://localhost:3000${producto.imagen}` : 'media/logo.png';

    modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header" style="background: var(--color-amarillo); color: black;">
                <h3><i class="fa-solid fa-pen-to-square"></i> Editando: ${producto.nombre}</h3>
                <span class="close" id="closeEditModal" style="color:black;">&times;</span>
            </div>
            
            <div class="modal-body">
                <form id="formEdicion" class="form-alta">
                    <div class="form-group">
                        <label>Imagen Actual</label>
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <img src="${imgPath}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc;">
                            <div style="flex: 1;">
                                <label style="font-size: 12px; color: gray;">Cambiar imagen (opcional):</label>
                                <input type="file" id="nuevaImagen" accept="image/*" class="input-modal">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="editNombre" class="input-modal" value="${producto.nombre}" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="editDescripcion" rows="3" class="input-modal" required>${producto.descripcion}</textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">
                            <label>Precio ($)</label>
                            <input type="number" id="editPrecio" step="0.01" class="input-modal" value="${producto.precio}" required>
                        </div>
                        <div class="form-group">
                            <label>Descuento (%)</label>
                            <input type="number" id="editDescuento" min="0" max="100" class="input-modal" value="${producto.descuento}" required>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">
                            <label>Stock</label>
                            <input type="number" id="editExistencias" min="0" class="input-modal" value="${producto.existencias}" required>
                        </div>
                        <div class="form-group">
                            <label>Categoría</label>
                            <select id="editCategoria" style="height: 45px;" class="input-modal" required>
                                <option value="">Selecciona...</option>
                                <option value="patrimoniales">Patrimoniales</option>
                                <option value="megafaunas">Megafaunas</option>
                                <option value="superdepredadores">Superdepredadores</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-actions">
                <button type="button" id="btnCancelarEdicion" class="btn-eliminar" style="background:#6c757d;">Cancelar</button>
                <button type="submit" form="formEdicion" class="btn-modificar" style="background:var(--color-verde); color:white;">Confirmar</button>
            </div>
        </div>
    `;

    document.getElementById("editCategoria").value = producto.categoria || "";

    document.getElementById("closeEditModal").onclick = cerrarModalConAnimacion;
    document.getElementById("btnCancelarEdicion").onclick = () => mostrarDetalles(producto);

    document.getElementById("formEdicion").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", document.getElementById("editNombre").value);
        formData.append("descripcion", document.getElementById("editDescripcion").value);
        formData.append("precio", document.getElementById("editPrecio").value);
        formData.append("descuento", document.getElementById("editDescuento").value);
        formData.append("existencias", document.getElementById("editExistencias").value);
        formData.append("categoria", document.getElementById("editCategoria").value);

        const fileInput = document.getElementById("nuevaImagen");
        if (fileInput.files[0]) { formData.append("imagen", fileInput.files[0]); }

        try {
            await servicios.updateProd(producto.id, formData);
            alert("Actualizado correctamente");
            cerrarModalConAnimacion();
            cargarProductos();
        } catch (err) {
            alert(err.message);
        }
    });
  }

  window.onclick = (event) => {
    if (event.target == modal) cerrarModalConAnimacion();
  };

  btnAddProduct.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("is-fading-out");
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="admin-modal-card">
            <div class="modal-header">
                <h3><i class="fa-solid fa-square-plus"></i> Añadir Producto</h3>
                <span class="close" id="closeAltaModal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="formAltaModal" class="form-alta">
                    <div class="form-group">
                        <label>Imagen</label>
                        <input type="file" id="imagenAlta" accept="image/*" class="input-modal" required />
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="nombreAlta" class="input-modal" required />
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="descAlta" rows="3" class="input-modal" required></textarea>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">    
                            <label>Precio</label>
                            <input type="number" id="precioAlta" step="0.01" class="input-modal" required />
                        </div>
                        <div class="form-group">
                            <label>Descuento</label>    
                            <input type="number" id="descValAlta" min="0" max="100" value="0" class="input-modal" required />
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group">
                            <label>Stock</label>
                            <input type="number" id="stockAlta" min="1" value="1" class="input-modal" required />
                        </div>
                        <div class="form-group">
                            <label>Categoría</label>
                            <select id="catAlta" class="input-modal" required>
                                <option value="">Selecciona...</option>
                                <option value="patrimoniales">Patrimoniales</option>
                                <option value="megafaunas">Megafaunas</option>
                                <option value="superdepredadores">Superdepredadores</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn-cancelar" id="btnCancelarAlta">Cancelar</button>
                <button type="submit" id="btn-guardar" form="formAltaModal" class="btn-guardar">Guardar</button>
            </div>
        </div>`;

    document.getElementById("closeAltaModal").onclick = cerrarModalConAnimacion;
    document.getElementById("btnCancelarAlta").onclick = cerrarModalConAnimacion;

    document.getElementById("formAltaModal").addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("nombre", document.getElementById("nombreAlta").value);
      formData.append("categoria", document.getElementById("catAlta").value);
      formData.append("descripcion", document.getElementById("descAlta").value);
      formData.append("precio", document.getElementById("precioAlta").value);
      formData.append("existencias", document.getElementById("stockAlta").value);
      formData.append("descuento", document.getElementById("descValAlta").value);
      
      const fileInput = document.getElementById("imagenAlta");
      if (fileInput.files[0]) formData.append("imagen", fileInput.files[0]);

      try {
        await servicios.addProduct(formData);
        alert("Producto guardado");
        cerrarModalConAnimacion();
        cargarProductos();
      } catch (error) {
        alert(error.message);
      }
    });
  });
});