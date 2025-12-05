const editar = document.getElementById("adminbtn");

if (editar) {
  editar.addEventListener("click", () => {
    window.location.href = "panelAdmin.html";
  });
}

if (localStorage.getItem("nombre")) {
  obtenerDatos();
}

async function obtenerDatos() {
  try {
    const response = await fetch("https://72.60.228.244:3000/back/auth/obtenerDatos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error obteniendo datos: " + response.status);
    }
    const data = await response.json();

    if (editar) {
      if (data.user.admin == 1) {
        editar.style.display = "block";
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const validaciones = {
  obtenerDatos
}

export default validaciones;