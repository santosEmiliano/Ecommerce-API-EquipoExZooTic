const getProd = async () => {
    //const params = new URLSearchParams(filtros).toString();

    try {
        const response = await fetch("http://localhost:3000/productos?${params}");
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

const servicios = {
  getProd,
  deleteProd
};

export default servicios;