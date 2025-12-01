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
    actualizarInterfazLogueado(usuarioGuardado);
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
        toast("Por favor ingresa correo y contraseña", "#ff4444");
        return;
      }

      console.log("Enviando login...");

      await servicios.login(correo, contrasena);

      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
    });
  }

  // --- REGISTRO ---

  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("regUser").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass1 = document.getElementById("regPass1").value.trim();
    const pass2 = document.getElementById("regPass2").value.trim();
    /*
    if (!user || !email || !pass1 || !pass2) {
      toast("Completa todos los campos", "#ff4444");
      return;
    }
    if (fakeUsers.includes(user.toLowerCase())) {
      toast("Usuario ya existente", "#ff4444");
      return;
    }
    if (pass1 !== pass2) {
      toast("Las contraseñas no coinciden", "#ff4444");
      return;
    }
*/
    toast("Cuenta creada con éxito", "#00c851");
    container.classList.remove("right-panel-active");

    document.getElementById("regUser").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPass1").value = "";
    document.getElementById("regPass2").value = "";
  });

  // --- LOGOUT ---
  logOutBtn.addEventListener("click", () => {
    servicios.logout();
  });

  function actualizarInterfazLogueado(nombre) {
    userName.textContent = nombre;
    userName.style.display = "inline";
    userIcon.style.display = "inline";
    logOutBtn.style.display = "inline";
    logInBtn.style.display = "none";
    regBtn.style.display = "none";
  }

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
