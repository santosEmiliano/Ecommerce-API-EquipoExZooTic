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
        localStorage.setItem("pais", data.datos.pais); ///--------->>>>
        localStorage.setItem("id", data.datos.id); ///--------->>>>
      } else {
        Swal.fire({
          title: "Credenciales incorrectas! 👹",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (parseErr) {
      console.warn("Respuesta no  es JSON del servidor", parseErr);
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
  document.getElementById("authModal").style.display = "none";
  document.getElementById("userName").style.display = "inline-block";
  document.getElementById("userName").innerHTML = `${nombre}`;
  document.getElementById("userIcon").style.display = "inline-block";
  document.getElementById("logInbtn").style.display = "none";
  document.getElementById("regbtn").style.display = "none";
  document.getElementById("logOutbtn").style.display = "inline-block";
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

    actualizarSesionLogOut();
  }
};

function actualizarSesionLogOut() {
  document.getElementById("userName").style.display = "none";
  document.getElementById("userIcon").style.display = "none";
  document.getElementById("logInbtn").style.display = "inline-block";
  document.getElementById("regbtn").style.display = "inline-block";
  document.getElementById("logOutbtn").style.display = "none";
}

//hola
const enviarCorreoContacto = async (formData) => {
  try {
    // formData es un objeto JSON { nombre, email, mensaje }
    const response = await fetch("http://localhost:3000/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al enviar mensaje");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al momento de hacer la peticion contacto:", error);
    throw error;
  }
};
//jaja

const pagar = async () => {
  const datosEnvio = {
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    ciudad: document.getElementById("ciudad").value,

    pais: localStorage.getItem("pais"),

    // Obtener cuál radio button está seleccionado
    metodoPago: document.querySelector('input[name="payment_method"]:checked')
      .value,
    cupon: document.getElementById("descuento").value,
    //ESTE DE AQUI ES IMPORTANTE
    email: document.getElementById("email").value,
  };

  const id = localStorage.getItem("id"); // Obtener esto de tu sesión o localStorage

  try {
    // 2. Realizar la petición POST
    const response = await fetch(`http://localhost:3000/api/compra/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ¡Muy importante!
      },
      body: JSON.stringify(datosEnvio), // Convertimos el objeto a texto para enviarlo
    });

    const data = await response.json();

    // 3. Manejar la respuesta
    if (response.ok) {
      Swal.fire({
        title: "Compra realizada con exito!!",
        icon: "success",

        confirmButtonText: "Ok",
      });
      // window.location.href = "/gracias.html";
    } else {
      Swal.fire({
        title: `Mensaje de error ${data.message}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("No se pudo conectar con el servidor.");
  }
};

const obtenerResumenCompra = async () => {
  try {
    const id = localStorage.getItem("id");
    const response = await fetch(`http://localhost:3000/api/compra/${id}`);

    if (response.status === 404) {
      alert("Producto no encontrado");
      return;
    }
    const data = await response.json();
    document.getElementById("subtotal").innerHTML = `$${data.subtotal}`;
    let paisBuscado = localStorage.getItem("pais");

    // Accedes al objeto específico usando corchetes
    let datosDelPais = data.tarifas[paisBuscado];

    // Ahora puedes sacar la tasa y el envío
    let tasa = datosDelPais.tasa;
    let envio = datosDelPais.envio;
    // Salida: Tasa: 0.16, Envío: 150
    const impuesto = data.subtotal * tasa;
    const totalFinal = data.subtotal + impuesto + envio;
    document.getElementById("total").innerHTML = `$${totalFinal}`;
  } catch (error) {
    console.error(error);
  }
};

//

const enviarCorreoSuscripcion = async (email) => {
  try {
    const response = await fetch("http://localhost:3000/api/suscripcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al suscribirse");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al momento de hacer la peticion suscripcion:", error);
    throw error;
  }
};
//jajajaj

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

      console.log(data.token); //guardar!!!
      console.log(data.id); //guardar!!!

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
  logout,
  signIn,
  getProd,
  addProduct,
  deleteProd,
  updateProd,
  enviarCorreoContacto,
  enviarCorreoSuscripcion,
  pagar,
  obtenerResumenCompra,
};

export default servicios;
