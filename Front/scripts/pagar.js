//Lógica de finalizar compra
document.addEventListener("DOMContentLoaded", () => {
  const radioCard = document.getElementById("pay_card");
  const radioSpei = document.getElementById("pay_spei");
  const radioOxxo = document.getElementById("pay_oxxo");

  const cardForm = document.getElementById("card-form");
  const speiInfo = document.getElementById("spei-info");
  const oxxoInfo = document.getElementById("oxxo-info");

  const speiRefDisplay = document.getElementById("speiRef");

  function generateReference() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `REF-${randomNum}`;
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
});
