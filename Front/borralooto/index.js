document.getElementById("boton").addEventListener("click", async () => {

    async function login() {
        

        
    try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: "as",//cambialos!
                    contrasena: "soyAdmin"
                })
            });

            if (!response.ok) {
                throw new Error("Error en el login: " + response.status);
            }

            const data = await response.json();
            console.log("Token:", data.token);//TOKEN!!!!!! GUDARDALO
            console.log(data);//todos los datos!!!
            //console.log(data.datos);//datos de el usuario
            console.log(data.datos.id);//TAMBIEN GUARDALO ES IMPORTANTE
            console.log(data.datos.nombre);//nombre
            console.log(data.datos.admin);//0 o 1 en  STRING
            console.log(data.datos.correo);
            console.log(data.datos.pais);
            console.log(data.datos.suscripcion);// 0 o 1 en STRING
            
        } catch (error) {
            console.error("Error al intentar logear:", error);
        }

    }

    // 🔥 AQUÍ es donde lo llamabas mal
    login();

});