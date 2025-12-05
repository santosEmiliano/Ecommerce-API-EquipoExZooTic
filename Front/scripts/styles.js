const preguntas = document.querySelectorAll(".container-pregunta");

//Sección General
//Animación de patitas
window.dispatchEvent(new Event("scroll"));
document.addEventListener("DOMContentLoaded", () => {
  let lastX = 0;
  let lastY = 0;
  const distanceThreshold = 100;

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const distance = Math.sqrt(
      Math.pow(mouseX - lastX, 2) + Math.pow(mouseY - lastY, 2)
    );

    if (distance > distanceThreshold) {
      crearHuella(mouseX, mouseY, lastX, lastY);
      lastX = mouseX;
      lastY = mouseY;
    }
  });

  function crearHuella(x, y, oldX, oldY) {
    const huella = document.createElement("i");
    huella.classList.add("fa-solid", "fa-paw", "huella-animada");
    const deltaX = x - oldX;
    const deltaY = y - oldY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const rotation = angle + 90;
    huella.style.left = `${x}px`;
    huella.style.top = `${y}px`;
    huella.style.setProperty("--rotacion", `${rotation}deg`);

    const tonos = [
      "var(--color--cafe-tierra)",
      "var(--color--cafe-madera)",
      "var(--color--cafe-claro)",
    ];
    huella.style.color = tonos[Math.floor(Math.random() * tonos.length)];

    document.body.appendChild(huella);
    setTimeout(() => {
      huella.remove();
    }, 1500);
  }
});

//Alert diseño
function toast(msg, color) {
  Toastify({
    text: msg,
    duration: 3800,
    gravity: "top",
    position: "right",
    close: true,
    stopOnFocus: true,
    offset: {
      x: 25,
      y: 80,
    },
    style: {
      background: `${color}`,
      border: "0.5vh solid #4C5F41",
      borderRadius: "1.8vh",
      padding: "2.2vh 3vh",
      fontSize: "2.4vh",
      fontWeight: "600",
      minWidth: "32vh",
      maxWidth: "46vh",
      color: "#000000",
      textAlign: "center",
      boxShadow: "0 0.8vh 1.6vh rgba(0,0,0,0.35)",
    },
  }).showToast();
}

const style = {
  toast
}

export default style;
