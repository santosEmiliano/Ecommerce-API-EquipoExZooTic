const login = async (correo, contrasena) => {
  try {
    const respuesta = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: correo,
        contrasena: contrasena,
      }),
    });

    let data;

    try {
      data = await respuesta.json();

      if (respuesta.ok) {
        actualizarSesionLogIn(data.datos.nombre);
        Swal.fire({
          title: "Sesión Iniciada Con Éxito!!",
          icon: "success",
          confirmButtonText: "Ok",
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("nombre", data.datos.nombre);
        localStorage.setItem("correo", data.datos.correo);
      } else {
        Swal.fire({
          title: "Credenciales incorrectas! 👹",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (parseErr) {
      console.warn("Respuesta no es JSON del servidor", parseErr);
      data = {};
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    Swal.fire({
      title: "Error al llamar al servidor°",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};

function actualizarSesionLogIn(nombre) {
  const modal = document.getElementById("authModal");
  if(modal) modal.style.display = "none";
  
  const userDisplay = document.getElementById("userName");
  if(userDisplay) {
      userDisplay.style.display = "inline-block";
      userDisplay.innerHTML = `${nombre}`;
  }

  const userIcon = document.getElementById("userIcon");
  if(userIcon) userIcon.style.display = "inline-block";

  const cartBtn = document.getElementById("cartBtn");
  if(cartBtn) cartBtn.style.display = "inline-block";

  const loginBtn = document.getElementById("logInbtn");
  if(loginBtn) loginBtn.style.display = "none";

  const regBtn = document.getElementById("regbtn");
  if(regBtn) regBtn.style.display = "none";

  const logoutBtn = document.getElementById("logOutbtn");
  if(logoutBtn) logoutBtn.style.display = "inline-block";
}

const logout = async () => {
  try {
    const res = await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      Swal.fire({
        title: "Sesión Cerrada Con Éxito!!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      const data = await res.json();
      Swal.fire({
        title: data?.error ?? `Error al cerrar sesión`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    Swal.fire({
      title: "Error de conexión",
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("correo");
    localStorage.removeItem("nombre");
    localStorage.removeItem("id");
    localStorage.removeItem("pais");

    actualizarSesionLogOut();
  }
};

function actualizarSesionLogOut() {
  const userDisplay = document.getElementById("userName");
  if(userDisplay) userDisplay.style.display = "none";

  const userIcon = document.getElementById("userIcon");
  if(userIcon) userIcon.style.display = "none";

  const cartBtn = document.getElementById("cartBtn");
  if(cartBtn) cartBtn.style.display = "none";

  const loginBtn = document.getElementById("logInbtn");
  if(loginBtn) loginBtn.style.display = "inline-block";

  const regBtn = document.getElementById("regbtn");
  if(regBtn) regBtn.style.display = "inline-block";

  const logoutBtn = document.getElementById("logOutbtn");
  if(logoutBtn) logoutBtn.style.display = "none";
}

const signIn = async (_nombre, _correo, _pais, _contrasena) => {
  try {
    const response = await fetch("http://localhost:3000/api/crud/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: _nombre,
        correo: _correo,
        contrasena: _contrasena,
        pais: _pais,
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la petición: " + response.status);
    } else {
      const data = await response.json();
      Swal.fire({
        title: "Cuenta registrada exitosamente!!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
};

const getProd = async (filtros = {}) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filtros).filter(([_, v]) => v != null && v !== "")
  );
  const params = new URLSearchParams(cleanFilters).toString();

  try {
    const response = await fetch(
      `http://localhost:3000/api/crud/productos?${params}`
    );
    if (!response.ok) throw new Error("Error al obtener productos");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// --- NUEVA FUNCIÓN AGREGADA ---
const getProdById = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/crud/productos/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo producto individual:", error);
        return null;
    }
};

const addProduct = async (formData) => {
  try {
    const response = await fetch("http://localhost:3000/api/crud/productos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al crear");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en addProduct:", error);
    throw error;
  }
};

const deleteProd = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/crud/productos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al eliminar");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en deleteProd:", error);
    throw error;
  }
};

const updateProd = async (id, formData) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/crud/productos/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al actualizar");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en updateProd:", error);
    throw error;
  }
};

const servicios = {
  login,
  actualizarSesionLogIn,
  logout,
  signIn,
  getProd,
  getProdById, // Exportamos la nueva función
  addProduct,
  deleteProd,
  updateProd,
};

export default servicios;