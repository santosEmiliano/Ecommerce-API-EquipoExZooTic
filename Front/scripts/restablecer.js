document
  .getElementById("formResetPass")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const btnSubmit = document.getElementById("btnSubmit");
    const p1 = document.getElementById("newPass").value;
    const p2 = document.getElementById("confirmPass").value;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (p1 !== p2) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }
    if (!token) {
      return Swal.fire(
        "Error",
        "Token no válido o no encontrado en el link",
        "error"
      );
    }

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Actualizando...";

    try {
      const res = await fetch("/back/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, nuevaContrasena: p1 }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Contraseña actualizada correctamente.",
          icon: "success",
          confirmButtonText: "Ir a Iniciar Sesión",
        }).then(() => {
          window.location.href = "index.html";
        });
      } else {
        Swal.fire("Error", data.message, "error");
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Actualizar";
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      btnSubmit.disabled = false;
      btnSubmit.innerText = "Actualizar";
    }
  });
