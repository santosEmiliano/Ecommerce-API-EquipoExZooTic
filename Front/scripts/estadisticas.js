import servicios from "./servicios.js";

// Envolvemos todo en una función asíncrona para poder esperar los datos
async function cargarGraficaVentas() {
  
  //Obtenemos el elemento del HTML
  const ctx = document.getElementById("barChart");

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
              "#4e79a7", 
              "#f28e2b", 
              "#e15759", 
              "#76b7b2", 
              "#59a14f"
            ],
            borderWidth: 1
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total vendido por Categoría'
            }
        }
      },
    });

  } catch (error) {
    console.error("Error al cargar la gráfica:", error);
  }
}

cargarGraficaVentas();