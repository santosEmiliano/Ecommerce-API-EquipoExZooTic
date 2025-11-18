const loginModal = document.getElementById("loginModal");
const regModal = document.getElementById("registerModal");
const logInBtn = document.getElementById("logInbtn");
const logOutBtn = document.getElementById("logOutbtn");
const RegBtn = document.getElementById("regbtn");
const closeModal = document.getElementById("closeModalLogin");
const closeModalRegister = document.getElementById("closeModalRegister");
const formLogin = document.getElementById("formLogin");
const userName = document.getElementById("userName");
const userIcon = document.getElementById("userIcon");






logOutBtn.style.display = "none";
userIcon.style.display = "none";
userName.style.display = "none";

logInBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});

closeModalRegister.addEventListener("click", () => {
  regModal.style.display = "none";
});

RegBtn.addEventListener("click", () => {
  regModal.style.display = "block";
});

//Login
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();



  if (user === "admin" && password === "123") {
    toast("Sesión iniciada", "#00c851");

    localStorage.setItem("usuario", user);
    loginModal.style.display = "none";

    userName.textContent = user;
    userName.style.display = "inline";
    userIcon.style.display = "inline";
    logOutBtn.style.display = "inline";
    logInBtn.style.display = "none";
  } else {
    toast("Usuario o contraseña incorrectos", "#ff4444");
  }
});


logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");
    toast("Adiosss ", "#ff4444");

  userName.style.display = "none";
  userIcon.style.display = "none";
  logOutBtn.style.display = "none";
  logInBtn.style.display = "inline";
});

window.addEventListener("load", () => {
  const usuario = localStorage.getItem("usuario");

  if (usuario) {
    userName.textContent = usuario;
    userName.style.display = "inline";
    userIcon.style.display = "inline";
    logOutBtn.style.display = "inline";
    logInBtn.style.display = "none";
  }
});

//  registro 
const fakeUsers = ["leo", "juan", "admin"];

formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass1 = document.getElementById("regPass1").value.trim();
  const pass2 = document.getElementById("regPass2").value.trim();

  if (!user || !email || !pass1 || !pass2) {
    toast("Llena todos los campos", "#ff4444");
    return;
  }

  if (fakeUsers.includes(user.toLowerCase())) {
    toast("Ese usuario ya existe", "#ff4444");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    toast("Correo invalido", "#ff4444");
    return;
  }


  if (pass1 !== pass2) {
    toast("Las contraseñas no coinciden", "#ff4444");
    return;
  }


  toast("Registro exitoso", "#00c851");

  regModal.style.display = "none";

  document.getElementById("regUser").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPass1").value = "";
  document.getElementById("regPass2").value = "";
});