import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("authModal");
  const container = document.getElementById("container-slid");

  const logInBtn = document.getElementById("logInbtn");
  const logOutBtn = document.getElementById("logOutbtn");
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");

  const userName = document.getElementById("userName");
  const userIcon = document.getElementById("userIcon");
  const iconClose = document.querySelector(".icon-close");

  const btnOlvidePass = document.getElementById("btnOlvidasteContra");

  if (servicios.verificarBloqueo) servicios.verificarBloqueo();

  if (logOutBtn) logOutBtn.style.display = "none";
  if (userIcon) userIcon.style.display = "none";
  if (userName) userName.style.display = "none";

  const usuarioGuardado = localStorage.getItem("nombre");
  if (usuarioGuardado) {
    servicios.actualizarSesionLogIn(usuarioGuardado);
  }

  const cerrarModalConAnimacion = () => {
    if (!authModal) return;
    authModal.classList.add("closing");
    authModal.addEventListener(
      "animationend",
      () => {
        authModal.style.display = "none";
        authModal.classList.remove("closing");
      },
      { once: true }
    );
  };

  if (logInBtn) {
    logInBtn.addEventListener("click", () => {
      servicios.cargarCaptcha();
      if (authModal) {
        authModal.classList.remove("closing");
        authModal.style.display = "flex";
      }
      if (container) container.classList.remove("right-panel-active");
    });
  }

  if (signUpButton && container) {
    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });
  }

  if (signInButton && container) {
    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }

  if (iconClose) {
    iconClose.addEventListener("click", cerrarModalConAnimacion);
  }

  // Cerrar modal al dar click afuera
  window.addEventListener("click", (e) => {
    if (authModal && e.target === authModal) {
      cerrarModalConAnimacion();
    }
  });

  // --- LOGOUT ---
  if (logOutBtn) {
    logOutBtn.addEventListener("click", () => {
      servicios.logout();
    });
  }

  const btnAcceder = document.getElementById("btnAcceder");
  if (btnAcceder) {
    btnAcceder.addEventListener("click", async (e) => {
      e.preventDefault();
      const correoInput = document.getElementById("login");
      const passInput = document.getElementById("password");
      const captchaInput = document.getElementById("captchaTxt");

      if (!captchaInput.value.trim()) {
        Swal.fire({
          title: "Ingresa captcha",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (!correoInput.value.trim() || !passInput.value.trim()) {
        Swal.fire({
          title: "Ingresa correo y contraseña",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      await servicios.login(
        correoInput.value.trim(),
        passInput.value.trim(),
        captchaInput.value.trim()
      );
      servicios.cargarCaptcha();

      correoInput.value = "";
      passInput.value = "";
      captchaInput.value = "";
    });
  }

  const btnRegistrarse = document.getElementById("btnRegistrarse");
  if (btnRegistrarse) {
    btnRegistrarse.addEventListener("click", async (e) => {
      e.preventDefault();
      const pass1 = document.getElementById("regPass");
      const pass2 = document.getElementById("regPass2");

      if (pass2 && pass1.value !== pass2.value) {
        Swal.fire({
          title: "Las contraseñas no coinciden",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      const nombre = document.getElementById("regName").value;
      const pais = document.getElementById("regCountry").value;
      const correo = document.getElementById("regEmail").value;
      const contrasena = pass1.value;

      if (!nombre || !pais || !correo || !contrasena) {
        Swal.fire({
          title: "Ingresa todos los campos",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      servicios.signIn(nombre, correo, pais, contrasena);

      document.getElementById("regName").value = "";
      document.getElementById("regCountry").value = "";
      document.getElementById("regEmail").value = "";
      pass1.value = "";
      if (pass2) pass2.value = "";

      Swal.fire({
        title: "Ya formas parte de la familia ExZootic!",
        icon: "success",
        confirmButtonText: "Ok",
      });

      if (container) container.classList.remove("right-panel-active");
    });
  }

  if (btnOlvidePass) {
    btnOlvidePass.addEventListener("click", (e) => {
      e.preventDefault();
      container.classList.add("show-forgot");
    });
  }

  if (btnVolverLogin) {
    btnVolverLogin.addEventListener("click", (e) => {
      e.preventDefault();
      container.classList.remove("show-forgot");
    });
  }

  if (formForgot) {
    formForgot.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("forgotEmail");
      const email = emailInput.value.trim();

      if (!email) return Swal.fire("Error", "Escribe tu correo", "error");

      const btnEnviar = document.getElementById("btnEnviarRecuperacion");
      const textoOriginal = btnEnviar.innerText;
      btnEnviar.innerText = "Enviando...";
      btnEnviar.disabled = true;

      try {
        const data = await servicios.solicitarRecuperacion(email);

        if (data.message == "No se encontro el usuario.") {
          Swal.fire({
            icon: "warning",
            title: "¡Usuario inexistente!",
            text: data.message,
            confirmButtonColor: "#4C5F41",
          }).then(() => {
            container.classList.remove("show-forgot");
            emailInput.value = "";
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "¡Correo Enviado!",
            text: data.message,
            confirmButtonColor: "#4C5F41",
          }).then(() => {
            container.classList.remove("show-forgot");
            emailInput.value = "";
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      } finally {
        btnEnviar.innerText = textoOriginal;
        btnEnviar.disabled = false;
      }
    });
  }

  const btnRegenerarCaptcha = document.getElementById("btnRegenerarCaptcha");
  if (btnRegenerarCaptcha) {
    btnRegenerarCaptcha.addEventListener("click", () => {
      servicios.cargarCaptcha();
    });
  }

  if (typeof toast !== "function") {
    window.toast = function (msg, color) {
      Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: color },
      }).showToast();
    };
  }
  actualizarContadorCarrito();
});

const actualizarContadorCarrito = async () => {
  if (localStorage.getItem("id")) {
    try {
      const carrito = await servicios.obtenerCarrito();

      if (Array.isArray(carrito)) {
        const totalArticulos = carrito.reduce((acumulador, producto) => {
          return acumulador + producto.cantidad;
        }, 0);

        const carritoCount = document.querySelector(".cart-count");
        if (carritoCount) {
          carritoCount.innerText = totalArticulos;
        }
      }
    } catch (error) {
      console.error("Error al actualizar contador:", error);
    }
  }
};
