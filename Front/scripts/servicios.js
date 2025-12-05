const login = async (correo, contrasena, captcha) => {
  try {
    const respuesta = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: correo,
        contrasena: contrasena,
        captcha: captcha,
      }),
    });

    const btnAcceder = document.getElementById("btnAcceder");

    let data;

    try {
      data = await respuesta.json();

      if (respuesta.ok) {
        // Si entra bien, quitamos cualquier bloqueo anterior 
        localStorage.removeItem("bloqueo_tiempo");
        document.getElementById("mensajeBloqueo").style.display = "none";

        if(btnAcceder) {
          btnAcceder.disabled = false;
          btnAcceder.innerHTML = "Acceder";
          btnAcceder.style.opacity = "1";
          btnAcceder.style.cursor = "pointer";
        }

        actualizarSesionLogIn(data.datos.nombre);

        Swal.fire({
          title: "Sesión Iniciada Con Éxito!!",
          icon: "success",
          confirmButtonText: "Ok",
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("nombre", data.datos.nombre);
        localStorage.setItem("correo", data.datos.correo);
        localStorage.setItem("pais", data.datos.pais); 
        localStorage.setItem("id", data.datos.id); 
      } else if(respuesta.status === 403){
        // Cuenta bloqueada

        // Calculamos los 5 minutos para el cronometro
        let tiempoGuardado = localStorage.getItem("bloqueo_tiempo");
        let tiempoDebloqueo

        if(tiempoGuardado && parent(tiempoGuardado) > Date.now()){
          tiempoDebloqueo = parseInt(tiempoGuardado);
        } else{
          tiempoDebloqueo = Date.now() + (5 * 60 * 1000);
          localStorage.setItem("bloqueo_tiempo", tiempoDebloqueo);  
        }

        iniciarCronometro(tiempoDebloqueo);

        Swal.fire({
          title: "Cuenta Bloqueada 🔒",
          text: data.mensaje || "Has excedido el número de intentos.",
          icon: "warning",
          confirmButtonText: "Ok",
        });
      } else{
        // Contraseña incorrecta

        Swal.fire({
          title: data.message || "Credenciales incorrectas 👹",
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

function iniciarCronometro(tiempoDebloqueo){
  const btnAcceder = document.getElementById("btnAcceder");
  const mensaje = document.getElementById("mensajeBloqueo");

  if(!btnAcceder || !mensaje) return;

  btnAcceder.desable = true;
  btnAcceder.style.pointerEvents = "none"; 
  btnAcceder.style.opacity = "0.5";
  btnAcceder.style.backgroundColor = "#ccc";
  btnAcceder.style.color = "#000";
  btnAcceder.style.cursor = "not-allowed";

  mensaje.style.display = "block";

  if (window.cronometroLogin) clearInterval(window.cronometroLogin);

  window.cronometroLogin = setInterval(() =>{
    const tiempoAhora = Date.now();
    const tiempoBloqueo = tiempoDebloqueo - tiempoAhora;

    if(tiempoBloqueo < 0){
      clearInterval(window.cronometroLogin);
      localStorage.removeItem("bloqueo_tiempo");

      mensaje.style.display = "none";
      mensaje.innerHTML = "";

      btnAcceder.disabled = false;
      btnAcceder.style.pointerEvents = "auto";
      btnAcceder.style.opacity = "1";
      btnAcceder.style.backgroundColor = "var(--color--verde-bosque)";
      btnAcceder.style.color = "#000";
      btnAcceder.style.cursor = "pointer";
      btnAcceder.innerHTML = "Acceder";

      return;
    }

    const min = Math.floor((tiempoBloqueo % (1000 * 60 * 60)) / (1000 * 60));
    const seg = Math.floor((tiempoBloqueo % (1000 * 60)) / 1000);

    mensaje.innerHTML = `Esperar: ${min}m ${seg}s para intentar de nuevo`;
    btnAcceder.innerHTML = `Bloqueado (${min}:${seg < 10 ? '0' + seg : seg})`; 
  }, 1000);
}

function verificarBloqueo(){
  const bloqueo = localStorage.getItem("bloqueo_tiempo");

  if(bloqueo){
    const tiempoBloqueo = parseInt(bloqueo);

    if (tiempoBloqueo > Date.now()){
      iniciarCronometro(tiempoBloqueo);
    } else{
      localStorage.removeItem("bloqueo_tiempo");

      const mensaje = document.getElementById("mensajeBloqueo");
      const btnAcceder = document.getElementById("btnAcceder");
      
      if (mensaje) {
          mensaje.style.display = "none";
          mensaje.innerHTML = "";
      }
      
      if (btnAcceder) {
          btnAcceder.disabled = false;
          btnAcceder.style.opacity = "1";
          btnAcceder.style.cursor = "pointer";
          btnAcceder.innerHTML = "Acceder";
      }
    }
  }
}

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

const enviarCorreoContacto = async (formData) => {
  try {
    // formData es un objeto JSON { nombre, email, mensaje }
    const response = await fetch("http://localhost:3000/api/contacto", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" 
      },
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

const pagar = async () => {
  const datosEnvio = {
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    ciudad: document.getElementById("ciudad").value,

    pais: document.getElementById("paisCompra").value,

    metodoPago: document.querySelector('input[name="payment_method"]:checked').value,
    cupon: document.getElementById("descuento").value,
    email: document.getElementById("email").value,
  };

  const id = localStorage.getItem("id"); 

  try {
    const response = await fetch(`http://localhost:3000/api/compra/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, },
      body: JSON.stringify(datosEnvio), 
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: "Compra realizada con exito!!",
        icon: "success",

        confirmButtonText: "Ok",
      });
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

const obtenerResumenCompra = async (pais) => {
  try {
    const id = localStorage.getItem("id");
    const response = await fetch(`http://localhost:3000/api/compra/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, },
    });

    if (response.status === 404) {
      alert("Producto no encontrado");
      return;
    }
    const data = await response.json();
    document.getElementById("subtotal").innerHTML = `$${data.subtotal}`;

    // Accedes al objeto específico usando corchetes
    let datosDelPais = data.tarifas[pais];

    // Ahora puedes sacar la tasa y el envío
    let tasa = datosDelPais.tasa;

    let envio = datosDelPais.envio;

    document.getElementById("costoEnvio"). innerHTML = `$${envio}`;
    
    // Salida: Tasa: 0.16, Envío: 150
    const impuesto = data.subtotal * tasa;

    document.getElementById("impuestos").innerHTML = `$${impuesto}`

    const totalFinal = data.subtotal + impuesto + envio;
    document.getElementById("total").innerHTML = `$${totalFinal}`;
  } catch (error) {
    console.error(error);
  }
};

const enviarCorreoSuscripcion = async (email) => {
  try {
    const response = await fetch("http://localhost:3000/api/suscripcion", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
        "Content-Type": "application/json" },
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

const signIn = async (_nombre, _correo, _pais, _contrasena) => {
  try {
    const response = await fetch("http://localhost:3000/auth/usuario", {
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

const obtenerVentasCategoria = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/stats/ventas-categoria`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
    );

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al obtener las ventas por categoria");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerVentasCategoria:", error);
    throw error;
  }
}

const obtenerVentasTotales = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/stats/ventas-total`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
    );

    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al obtener las ventas totales");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerVentasTotales:", error);
    throw error;
  }
}

const obtenerExistencias = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/stats/existencias`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
    );
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message || "Error al obtener el reporte de existencias");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerExistencias:", error);
    throw error;
  }
}
const cargarCaptcha = async () => {
  const res = await fetch("http://localhost:3000/captcha");
      const svg = await res.text();
      document.getElementById("captchaContainer").innerHTML = svg;
}


const servicios = {
  login,
  actualizarSesionLogIn,
  verificarBloqueo,
  iniciarCronometro,
  logout,
  signIn,
  getProd,
  getProdById, 
  addProduct,
  deleteProd,
  updateProd,
  enviarCorreoContacto,
  enviarCorreoSuscripcion,
  pagar,
  obtenerResumenCompra,
  obtenerVentasCategoria,
  obtenerVentasTotales,
  obtenerExistencias,
  cargarCaptcha,  
};

export default servicios;