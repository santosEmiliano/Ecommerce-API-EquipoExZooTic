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

/*Mensaje para edson */
/*En este app.js tienes que añadir toda la lógica de tu captcha, 
mas aparte haste las verificaciones básicas para que funcione el regístro
y lógin, obvio como te dije, nada con apis, sólo create unos condicionales
así tipo if(regUser===edson){alert(simon carnal)}else{alert(pendejo estás mal)} */

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

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("login").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "123") {
    localStorage.setItem("usuario", user);
    loginModal.style.display = "none";

    userName.textContent = user;

    userName.style.display = "inline";
    userIcon.style.display = "inline";
    logOutBtn.style.display = "inline";
    logInBtn.style.display = "none";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuario");

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
