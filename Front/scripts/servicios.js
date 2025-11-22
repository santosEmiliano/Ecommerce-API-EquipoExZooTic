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

const servicios = {
  getProd
};

export default servicios;