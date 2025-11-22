document.getElementById("boton").addEventListener("click", async () => {

    async function login() {
        

         try {
            const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzYzNzg1NDY0LCJleHAiOjE3NjM3ODkwNjR9.rk89_Qjzgaq2Hb9h5xtJcpkZSC8swqUkvbNIfDOFj8Y";
        const response = await fetch("http://localhost:3000/auth/obtenerDatos", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // <-- tu token
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error obteniendo datos: " + response.status);
        }

        const data = await response.json();
        console.log("Datos del usuario:", data.user);

console.log(data.user.nombre);
console.log(data.user.correo);
console.log(data.user.pais);
console.log(data.user.admin);
console.log(data.user.suscripcion);

    } catch (error) {
        console.error("Error:", error);
    }
    }

    // 🔥 AQUÍ es donde lo llamabas mal
    login();

});