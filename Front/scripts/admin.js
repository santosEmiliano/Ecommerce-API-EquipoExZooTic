import servicios from "./servicios.js";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnProd").onclick = () => {
    servicios.getProd();
  };
});
