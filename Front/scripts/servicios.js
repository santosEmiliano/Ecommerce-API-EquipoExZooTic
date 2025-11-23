const getProd = async () => {
    try {
        const response = await fetch("http://localhost:3000/productos");
        if(!response.ok) throw new Error("Error al obtener productos");
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const deleteProd = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log("Producto eliminado correctamente");
        } else {
            console.error("Error:", result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

const updateProd = async (id, data) => {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "PUT",
            body: data 
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Producto actualizado");
        } else {
            console.error("Error:", result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

const servicios = {
  getProd,
  deleteProd,
  updateProd
};

export default servicios;