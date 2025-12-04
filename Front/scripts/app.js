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
        Swal.fire({ title: "Ingresa captcha", icon: "error", confirmButtonText: "Ok" });
        return;
      }
      if (!correoInput.value.trim() || !passInput.value.trim()) {
        Swal.fire({ title: "Ingresa correo y contraseña", icon: "error", confirmButtonText: "Ok" });
        return;
      }

      await servicios.login(correoInput.value.trim(), passInput.value.trim(), captchaInput.value.trim());
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
        Swal.fire({ title: "Las contraseñas no coinciden", icon: "error", confirmButtonText: "Ok" });
        return;
      }

      const nombre = document.getElementById("regName").value;
      const pais = document.getElementById("regCountry").value;
      const correo = document.getElementById("regEmail").value;
      const contrasena = pass1.value;

      servicios.signIn(nombre, correo, pais, contrasena);

      document.getElementById("regName").value = "";
      document.getElementById("regCountry").value = "";
      document.getElementById("regEmail").value = "";
      pass1.value = "";
      if (pass2) pass2.value = "";

      if (container) container.classList.remove("right-panel-active");
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
});