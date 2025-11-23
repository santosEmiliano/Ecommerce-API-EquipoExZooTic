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

  // Función helper para cerrar con animación
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

      // Aseguramos que no tenga clases de cierre previas al abrir
      modal.classList.remove("is-fading-out");
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

      // Usamos la nueva función para cerrar
      document.getElementById("closeInfoModal").onclick =
        cerrarModalConAnimacion;

      const btnEditar = document.getElementById("btnEditar");
      btnEditar.onclick = () => {
        console.log("Guardando cambios del ID:", id);
        cerrarModalConAnimacion();
      };
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

      const inputImagen = document.querySelector("#imagen"); // como sea que tengan el html que agarra las imagenes
      const nombre = document.querySelector("#nombre").value; // Nombre
      const categoria = document.querySelector("#categoria").value; // Categoria
      const descripcion = document.querySelector("#descripcion").value; // descripcion
      const precio = document.querySelector("#precio").value
      const existencias = document.querySelector("#cantidadAlta").value
      const descuento = document.querySelector("#descuento").value

      const formData = new FormData();
      // Los nombres ("keys") de los datos deben coincidir con lo que espera tu backend (req.body) porfa

      //Aca lo agarran de donde ocupen, estos son solo datos de ejemplo
      formData.append("nombre", nombre);
      formData.append("categoria", categoria);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("existencias", existencias);
      formData.append("descuento", descuento);

      // 'imagen' debe coincidir con upload.single('imagen') en tu ruta tambien porfa que sino se traba esto
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

          // Recargamos la lista de productos para ver el nuevo
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
  // Listener global para cerrar si das click fuera del modal
  // Usamos addEventListener para no sobreescribir el de admin.js
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      cerrarModalConAnimacion();
    }
  });
});
