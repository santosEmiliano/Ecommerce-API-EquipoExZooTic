//  CONTROLADOR DE LAS RUTAS DE COMPRA
// Importamos la libreria para mandar correos
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

//Import de los model que se encargan de las funciones en base de datos
const carritoModel = require("../model/carritoModel");
const ventasModel = require("../model/ventasModel");
const crudModel = require("../model/crudModel");
const cuponModel = require("../model/cuponModel");

// Importar el generador de PDF
const { generarNotaPDF } = require("../utils/generarPDF");

//Import del JSON de tarifas
const tarifasData = require("../data/tarifas.json");

// Transporter para los correos
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const obtenerResumenCompra = async (req, res) => {
  const idUser = req.params.id;
  try {
    //Obtenemos las coincidencias con la id del usuario del carrito
    const productosCarrito = await carritoModel.getCarritoUsuario(idUser);

    //Si intentan comprar sin nada en el carrito no les va a salir nada obviamente.
    if (!productosCarrito || productosCarrito.length === 0) {
      return res.json({
        status: "success",
        carrito: [],
        subtotal: 0,
        tarifas: tarifasData,
      });
    }

    const carrito = await Promise.all(
      productosCarrito.map(async (item) => {
        //Sin el promise no jala el await y por ende no jala la peticion a la base de datos
        const productoInfo = await crudModel.getProdID(item.producto);
        return {
          ...productoInfo,
          cantidad: item.cantidad,
        };
      })
    );

    //Sacamos la suma de todo el carrito
    let subtotal = 0;
    if (carrito.length > 0) {
      //Esto funciona como un ciclo for para realizar la suma de cada una de las cosas
      subtotal = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.precio * producto.cantidad;
      }, 0);
    }

    //Enviamos el json con todos los datos
    res.json({
      status: "success",
      carrito: carrito,
      subtotal: subtotal,
      tarifas: tarifasData, // Aqui va lo de las tarifas para que lo manejen en el front
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener carrito" });
  }
};

const confirmarCompra = async (req, res) => {
  //Como esta funcion hace muchas cosas, la voy a dividir en varias partes

  //PARTE 0: Sacar datos del req
  const idUser = req.params.id;
  const datosFormulario = req.body;

  try {
    //PARTE 1: ESTRUCTURAR LA INFORMACION, EL TOTAL Y EL PAGO POR CATEGORIA

    if (!datosFormulario.pais || !datosFormulario.direccion) {
      return res
        .status(400)
        .json({ message: "Faltan los datos sobre el envío" });
    }

    if (datosFormulario.cantidad < 0) {
      return res.status(400).json({ message: "Envio de datos incorrecto" });
    }

    //Obtenemos las coincidencias con la id del usuario del carrito
    const productosCarrito = await carritoModel.getCarritoUsuario(idUser);

    //Tristemente, si no tienen nada en el carrito, no les cobramos
    if (!productosCarrito || productosCarrito.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const carrito = await Promise.all(
      productosCarrito.map(async (item) => {
        //Sin el promise no jala el await y por ende no jala la peticion a la base de datos
        const productoInfo = await crudModel.getProdID(item.producto);
        return {
          ...productoInfo,
          cantidad: item.cantidad,
        };
      })
    );

    console.log(carrito);

    //Por categorias
    const ventasPorCategoria = {};

    //Subtotal
    let subtotal = 0;

    for (const producto of carrito) {
      if (producto.existencias < producto.cantidad) {
        await carritoModel.deleteProducto(idUser, producto.id);
        return res.status(400).json({
          status: "error",
          message: `El producto '${producto.nombre}' no tiene suficientes existencias. Se ha eliminado de tu carrito.`,
        });
      }
    }

    for (const producto of carrito) {
      const nombreCategoria = producto.categoria; // Sacamos la categoria
      const totalProducto = producto.precio * producto.cantidad; //Sacamos el total del producto

      subtotal += totalProducto; //Sumamos el total del producto

      if (ventasPorCategoria[nombreCategoria]) {
        // Si la categoría ya existe en nuestro objeto, le sumamos
        ventasPorCategoria[nombreCategoria] += totalProducto;
      } else {
        // Si es la primera vez que sale esta categoría, la inicializamos
        ventasPorCategoria[nombreCategoria] = totalProducto;
      }

      await crudModel.updateStock(
        producto.id,
        producto.existencias - producto.cantidad
      );
    }
    //Obtenemos todos los datos del front
    const infoPais =
      tarifasData[datosFormulario.pais] || tarifasData["DEFAULT"];
    const costoEnvio = infoPais.envio;
    const impuesto = subtotal * infoPais.tasa;

    let descuento = 0;

    if (datosFormulario.cupon) {
      const codigoCupon = datosFormulario.cupon.trim().toUpperCase();
      const cupon = await cuponModel.getCupon(codigoCupon);
      console.log(cupon);
      if (cupon) {
        if (await cuponModel.verificarUso(idUser, cupon.id)) {
          descuento = subtotal * cupon.descuento;
        }
      }
    }

    console.log(subtotal, impuesto, costoEnvio, descuento);
    const totalFinal = subtotal - descuento + impuesto + costoEnvio;
    console.log(totalFinal);

    //PARTE 3: GUARDAR EN LAS CATEGORIAS LOS PAGOS
    await ventasModel.agregarPago(ventasPorCategoria);

    //PARTE 4: LIMPIAR EL CARRITO DEL USUARIO
    await carritoModel.deleteCarrito(idUser);

    // --- GENERAR PDF Y ENVIAR CORREO ---
    try {
      const rutaLogo = path.join(__dirname, "../media/logo.png");
      let logoBase64 = "";
      try {
        if (fs.existsSync(rutaLogo)) {
          const logoBuffer = fs.readFileSync(rutaLogo);
          logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
        }
      } catch (e) {
        console.log("Sin logo");
      }

      const datosPDF = {
        id: Date.now(),
        cliente: {
          nombre: datosFormulario.nombre || "Cliente",
          email: datosFormulario.email,
          direccion: datosFormulario.direccion,
        },
        productos: carrito,
        subtotal: subtotal,
        impuestos: impuesto,
        envio: costoEnvio,
        descuento: descuento,
        totalGeneral: totalFinal,
        logoUrl: logoBase64,
      };

      console.log("Generando PDF...");
      const pdfBuffer = await generarNotaPDF(datosPDF);

      console.log("Enviando correo...");
      const mailOptions = {
        from: `"ExZooTic - Ventas" <${process.env.GMAIL_USER}>`,
        to: datosFormulario.email,
        subject: `Confirmación de Compra - Pedido #${datosPDF.id}`,
        html: `<h1>¡Gracias por tu compra!</h1><p>Total: $${totalFinal}</p>`,
        attachments: [
          { filename: `NotaCompra-${datosPDF.id}.pdf`, content: pdfBuffer },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log("Correo enviado.");
    } catch (emailError) {
      console.error(
        "ALERTA: Compra exitosa pero falló el correo/PDF:",
        emailError
      );
    }

    // --- RESPUESTA EXITOSA AL CLIENTE ---
    res.json({
      status: "success",
      message: "Compra realizada con éxito",
      total_cobrado: totalFinal,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al procesar la compra" });
  }
};

const verificarCupon = async (req, res) => {
  const { codigo } = req.params;

  try {
    const datosCupon = await cuponModel.getCupon(codigo);

    if (datosCupon) {
      return res.status(200).json({
        message: "Cupon correcto",
        cupon: datosCupon,
      });
    }

    return res.status(404).json({
      message: "Cupón incorrecto o no encontrado",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Error al verificar el cupon" });
  }
};

module.exports = {
  obtenerResumenCompra,
  confirmarCompra,
  verificarCupon,
};
