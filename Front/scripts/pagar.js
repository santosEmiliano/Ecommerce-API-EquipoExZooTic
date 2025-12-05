import servicios from "./servicios.js";
//Lógica de finalizar compra
document.addEventListener("DOMContentLoaded", () => {
  const radioCard = document.getElementById("pay_card");
  const radioSpei = document.getElementById("pay_spei");
  const radioOxxo = document.getElementById("pay_oxxo");

  const cardForm = document.getElementById("card-form");
  const speiInfo = document.getElementById("spei-info");
  const oxxoInfo = document.getElementById("oxxo-info");

  const speiRefDisplay = document.getElementById("speiRef");

  const selectPais = document.getElementById("paisCompra");

  servicios.obtenerResumenCompra(localStorage.getItem("pais"));
  selectPais.value = localStorage.getItem("pais");

  function generateReference() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `REF-${randomNum}`;
  }

  if (selectPais) {
    selectPais.addEventListener("change", (e) => {
      servicios.obtenerResumenCompra(selectPais.value);
    });
  }

  function updatePaymentMethod() {
    cardForm.classList.remove("active");
    speiInfo.classList.remove("active");
    oxxoInfo.classList.remove("active");

    if (radioCard.checked) {
      cardForm.classList.add("active");
    } else if (radioSpei.checked) {
      speiInfo.classList.add("active");

      if (
        speiRefDisplay.innerText === "GENERANDO..." ||
        speiRefDisplay.innerText === ""
      ) {
        speiRefDisplay.innerText = generateReference();
      }
    } else if (radioOxxo.checked) {
      oxxoInfo.classList.add("active");
    }
  }

  const radios = document.getElementsByName("payment_method");
  radios.forEach((radio) => {
    radio.addEventListener("change", updatePaymentMethod);
  });

  updatePaymentMethod();

  document.getElementById("botonComprar").onclick = () => {
    servicios.pagar();
  };

  document.getElementById("btnValidarCupon").onclick = async () => {
    const btn = document.getElementById("btnValidarCupon");
    const inputCupon = document.getElementById("descuento");
    const codigo = inputCupon.value.trim();

    if(!codigo) return; 

    btn.disabled = true;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; 

    try {
        const resultado = await servicios.verificarCupon(codigo);

        Swal.fire({
          icon: "success",
          title: "Cupón Aplicado",
          text: `Se aplicó un descuento del ${resultado.cupon.descuento}%`,
          timer: 2000,
          showConfirmButton: false
        });
        
        aplicarDescuentoVisual(resultado.cupon.descuento); 

    } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Cupón incorrecto", 
        }); 
        inputCupon.value = ""; 
    } finally {
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
    }
  };
});

const aplicarDescuentoVisual = (porcentajeDescuento) => {
    const subtotalElem = document.getElementById("subtotal");
    const totalElem = document.getElementById("total");
    const envioElem = document.getElementById("costoEnvio");
    const impuestoElem = document.getElementById("impuestos");

    let subtotal = parseFloat(subtotalElem.innerText.replace('$', '')) || 0;
    let envio = parseFloat(envioElem.innerText.replace('$', '')) || 0;
    let impuestos = parseFloat(impuestoElem.innerText.replace('$', '')) || 0;

    const cantidadDescontada = subtotal * (porcentajeDescuento);
    
    const nuevoTotal = (subtotal - cantidadDescontada) + envio + impuestos;

    totalElem.innerText = `$${nuevoTotal.toFixed(2)}`;
}