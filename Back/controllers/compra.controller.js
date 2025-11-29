//  CONTROLADOR DE LAS RUTAS DE COMPRA

//Import de los model que se encargan de las funciones en base de datos
const carritoModel = require('../model/carritoModel');
const ventasModel = require('../model/ventasModel');

//Import del JSON de tarifas
const tarifasData = require('../data/tarifas.json');

const obtenerResumenCompra = async (req, res) => {
    const idUser = req.params.id;
    try {
        //Obtenemos el carrito
        const datosUsuario = await carritoModel.getCarritoUsuario(idUser);

        // Validacion
        if (!datosUsuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Ya sacamos el json con '[]' por si no hay nada
        const carrito = JSON.parse(datosUsuario.carrito || '[]');

        //Sacamos la suma de todo el carrito
        let subtotal = 0;
        if (carrito.length > 0) {
            //Esto funciona como un ciclo for para realizar la suma de cada una de las cosas
            subtotal = carrito.reduce((acumulador, producto) => {
                return acumulador + (producto.precio * producto.cantidad);
            }, 0);
        }

        //Enviamos el json con todos los datos
        res.json({
            status: "success",
            carrito: carrito,
            subtotal: subtotal,
            tarifas: tarifasData // Aqui va lo de las tarifas para que lo manejen en el front
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al obtener carrito" });
    }
}

const confirmarCompra = async (req, res) => {
    //Como esta funcion hace muchas cosas, la voy a dividir en varias partes

    //PARTE 0: Sacar datos del req
    const idUser = req.params.id;
    const datosFormulario = req.body;

    try {
        //PARTE 1: ESTRUCTURAR LA INFORMACION, EL TOTAL Y EL PAGO POR CATEGORIA

        if (!datosFormulario.pais || !datosFormulario.direccion) {
            return res.status(400).json({ message: "Faltan los datos sobre el envío" });
        }

        //Aqui volvemos a obtener todos los datos de pago
        const datosUsuario = await carritoModel.getCarritoUsuario(idUser);

        // Validacion
        if (!datosUsuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Ya sacamos el json con '[]' por si no hay nada
        const carrito = JSON.parse(datosUsuario.carrito || '[]');

        //Por categorias
        const ventasPorCategoria = {}; 

        //Subtotal
        let subtotal = 0; 

        carrito.forEach(producto => {
            const nombreCategoria = producto.categoria; // Sacamos la categoria
            const totalProducto = producto.precio * producto.cantidad; //Sacamos el total del producto

            subtotal += totalProducto; //Sumamos el total del producto

            if (ventasPorCategoria[nombreCategoria]) { // Si la categoría ya existe en nuestro objeto, le sumamos
                ventasPorCategoria[nombreCategoria] += totalProducto;
            } else { // Si es la primera vez que sale esta categoría, la inicializamos
                ventasPorCategoria[nombreCategoria] = totalProducto;
            }
        });

        //PARTE 2: GUARDAR EN LAS CATEGORIAS LOS PAGOS
        await ventasModel.agregarPago(ventasPorCategoria);
        await carritoModel.deleteCarrito(idUser);
        
        //Obtenemos todos los datos del front
        const infoPais = tarifasData[datosFormulario.pais] || tarifasData["DEFAULT"];
        const costoEnvio = infoPais.envio;
        const impuesto = subtotal * infoPais.tasa;
        const totalFinal = subtotal + costoEnvio + impuesto;

        //ACA ES DONDE IRIA TODO EL SHOW DE LO DEL CORREO Y ESO SUPONGO

        res.json({
            status: "success",
            message: "Compra realizada con éxito",
            total_cobrado: totalFinal
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al procesar la compra" });
    }
}

module.exports = {
    obtenerResumenCompra,
    confirmarCompra
}