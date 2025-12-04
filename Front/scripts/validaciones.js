const editar= document.getElementById("adminbtn");


editar.addEventListener("click",()=>{
    window.location.href = "panelAdmin.html";
})

if(localStorage.getItem("nombre")){
    obtenerDatos();
}

async function obtenerDatos() {
    
    try {
            
        const response = await fetch("http://localhost:3000/auth/obtenerDatos", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Error obteniendo datos: " + response.status);
        }
        const data = await response.json();

        
        if(data.user.admin==1){
            editar.style.display="block";
        }
        
    } catch (error) {
        console.error("Error:", error);
    }

    
}

