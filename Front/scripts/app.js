import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- REFERENCIAS AL DOM ---
  const authModal = document.getElementById("authModal");
  const container = document.getElementById("container-slid");

  // Header Buttons
  const logInBtn = document.getElementById("logInbtn");
  const regBtn = document.getElementById("regbtn");
  const logOutBtn = document.getElementById("logOutbtn");

  // User Info
  const userName = document.getElementById("userName");
  const userIcon = document.getElementById("userIcon");

  // Modal Buttons
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const iconClose = document.querySelector(".icon-close");

  // Forms
  const formLogin = document.getElementById("formLogin");
  const formRegister = document.getElementById("formRegister");

  // --- ESTADO INICIAL ---
  logOutBtn.style.display = "none";
  userIcon.style.display = "none";
  userName.style.display = "none";

  const usuarioGuardado = localStorage.getItem("nombre");
  if (usuarioGuardado) {
    servicios.actualizarSesionLogIn(localStorage.getItem("nombre"));
  }

  // --- ABRIR MODAL ---
  logInBtn.addEventListener("click", () => {
    authModal.style.display = "flex";
    container.classList.remove("right-panel-active");
  });

  regBtn.addEventListener("click", () => {
    authModal.style.display = "flex";
    container.classList.add("right-panel-active");
  });

  // --- SLIDER INTERNO ---
  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  // --- CERRAR MODAL ---
  iconClose.addEventListener("click", () => {
    authModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      authModal.style.display = "none";
    }
  });

  const btnAcceder = document.getElementById("btnAcceder");

  if (btnAcceder) {
    btnAcceder.addEventListener("click", async (e) => {
      e.preventDefault();

      const correo = document.getElementById("login").value.trim();
      const contrasena = document.getElementById("password").value.trim();

      if (!correo || !contrasena) {
        Swal.fire({
          title: "Ingresa correo y contraseña",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      await servicios.login(correo, contrasena);

      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
    });
  }

  // --- REGISTRO ---

  const btnRegistrarse = document.getElementById("btnRegistrarse");

  if (btnRegistrarse) {
    btnRegistrarse.addEventListener("click", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("regName").value;
      const pais = document.getElementById("regCountry").value;
      const correo = document.getElementById("regEmail").value;
      const contrasena = document.getElementById("regPass").value;

      servicios.signIn(nombre, correo, pais, contrasena);

      document.getElementById("regName").value = "";
      document.getElementById("regCountry").value = "";
      document.getElementById("regEmail").value = "";
      document.getElementById("regPass").value = "";

      container.classList.remove("right-panel-active");
    });
  }

  // --- LOGOUT ---
  logOutBtn.addEventListener("click", () => {
    servicios.logout();
  });

  // Definición de Toast si no existe
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
