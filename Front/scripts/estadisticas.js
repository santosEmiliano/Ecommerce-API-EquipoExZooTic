import servicios from "./servicios.js";

//Funcion para que se vea bonito el dinero
const formatoMoneda = (valor) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);
};

// EventListner para cargar todo cuando ya este el admin en la pagina
document.addEventListener("DOMContentLoaded", () => {
  cargarTodo();
});

// Funcion para que todo se muestre
async function cargarTodo() {
  console.log("Iniciando panel Estadisticas");
  await cargarGraficaVentas();
  await cargarVentasTotales();
  await cargarReporteExistencias();
}

// Envolvemos todo en una función asíncrona para poder esperar los datos
async function cargarGraficaVentas() {
  //Obtenemos el elemento del HTML
  const ctx = document.getElementById("barChart");
  if (!ctx) return;

  try {
    // Sacamos la info con el fetch
    const respuesta = await servicios.obtenerVentasCategoria();

    // Imprimimos los datos en consola
    console.log("Datos para la gráfica:", respuesta);

    // Creamos la gráfica con los datos recibidos
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: respuesta.categorias, //Las categorias
        datasets: [
          {
            label: "Ganancias (MXN)",
            data: respuesta.ventas, //Los datos
            backgroundColor: [
              "#2f5d34",
              "#4c5f41",
              "#597a4a",
              "#7ab24e",
              "#9fdc7a",
              "#c7e86a",
              "#1d8e7a",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Total vendido por Categoría",
            color: "#4c5f41",
            font: {
              size: 16,
              family: "'DynaPuff', system-ui",
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al cargar la gráfica:", error);
  }
}

// Funcion para el total de ventas
async function cargarVentasTotales() {
  const display = document.getElementById("total-ventas-display");
  if (!display) return;

  try {
    const data = await servicios.obtenerVentasTotales();
    // data.total viene del backend
    display.textContent = formatoMoneda(data.total);
  } catch (error) {
    console.error("Error total ventas:", error);
    display.textContent = "$0.00";
  }
}

// Funcion para el reporte de existencias
async function cargarReporteExistencias() {
  const container = document.getElementById("inventory-container");
  if (!container) return;

  try {
    const data = await servicios.obtenerExistencias();
    const reporte = data.reporte;

    container.innerHTML = "";

    for (const [categoria, productos] of Object.entries(reporte)) {
      // Contenedor por categoría
      const categoriaBloque = document.createElement("div");

      // Título
      const titulo = document.createElement("h3");
      titulo.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${categoria}`;
      categoriaBloque.appendChild(titulo);

      // Tabla
      const tabla = document.createElement("table");
      tabla.classList.add("tabla-admin");

      tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Existencias</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos
                      .map((prod) => {
                        const stockBajo = prod.existencias < 5;

                        const claseEstado = stockBajo
                          ? 'class="status-danger"'
                          : 'class="status-ok"';
                        const estadoTexto = stockBajo
                          ? "⚠️ BAJO STOCK"
                          : "✅ OK";

                        return `
                            <tr>
                                <td>#${prod.id}</td>
                                <td>${prod.nombre}</td>
                                <td>${prod.existencias}</td>
                                <td ${claseEstado}>${estadoTexto}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            `;

      categoriaBloque.appendChild(tabla);
      container.appendChild(categoriaBloque);
    }
  } catch (error) {
    console.error("Error inventario:", error);
    container.innerHTML = "<p>Error al cargar el inventario.</p>";
  }
}
