const getProd = async (filtros = {}) => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v != null && v !== '')
    );
    const params = new URLSearchParams(cleanFilters).toString();
   
   try {
       const response = await fetch(`http://localhost:3000/productos?${params}`);
       if(!response.ok) throw new Error("Error al obtener productos");
       const data = await response.json();
       return data;
   } catch (error) {
       console.error(error);
       return [];
   }
};

const addProduct = async (formData) => {
    try {
        const response = await fetch("http://localhost:3000/productos", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.message || "Error al crear");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en addProduct:", error);
        throw error;
    }
};

const deleteProd = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.message || "Error al eliminar");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en deleteProd:", error);
        throw error;
    }
};

const updateProd = async (id, formData) => {
    try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "PUT",
            body: formData 
        });
        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.message || "Error al actualizar");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en updateProd:", error);
        throw error;
    }
};

const servicios = {
  getProd,
  addProduct,
  deleteProd,
  updateProd
};

export default servicios;