import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
    const productosGrid = document.getElementById("products-grid");

    cargarProductos();
    document.getElementById("btnProd").onclick = () => {
        cargarProductos();
    };
  
    async function cargarProductos() {
        try {
            const productos = await servicios.getProd();
            
            let html = "";

            if(!Array.isArray(productos) || productos.length === 0){
                console.log("No hay productos o el formato es incorrecto");
                return;
            }
            
            productos.forEach((producto) => {
                html += `
                <div>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h2>${producto.nombre}</h2>
                    <button>Ver Detalles</button>
                </div>`; 
            });
            
            productosGrid.innerHTML = html;

        } catch (error) {
            console.error("Hubo un error cargando los productos:", error);
        }
    }
});

