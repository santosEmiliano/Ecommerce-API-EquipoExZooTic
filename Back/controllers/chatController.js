const { GoogleGenerativeAI } = require("@google/generative-ai");
const crudModel = require("../model/crudModel");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const chatWithGemini = async (req, res) => {
  try {
    const { history, message } = req.body;

    console.log("--- CHAT REQUEST ---");
    console.log("Usuario dice:", message);

    const productosDB = await crudModel.getProductos();

    let inventarioTexto = "No hay productos disponibles por el momento.";

    if (productosDB && productosDB.length > 0) {
      inventarioTexto = JSON.stringify(
        productosDB.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          categoria: p.categoria,
          precio: p.precio,
          stock: p.existencias,
          descripcion: p.descripcion,
          en_oferta: p.descuento > 0,
        }))
      );
    }

    const instruccionSistema = `
        ACTÚA COMO: Un guía experto y aventurero de "ExZooTic", una tienda ética de animales exóticos.
        TONO: Amable, entusiasta, educativo y profesional. Usa emojis de animales y naturaleza 🌿🦁.
        
        INVENTARIO EN TIEMPO REAL (BASE DE DATOS): 
        ${inventarioTexto}

        REGLAS:
        1. Responde basándote EXCLUSIVAMENTE en el INVENTARIO de arriba.
        2. Si el stock es 0, informa amablemente que está agotado pero sugiere otro animal de la misma categoría.
        3. Si preguntan precios, usa el precio exacto de la lista.
        4. Si preguntan por un animal que NO está en la lista JSON, di que "actualmente no lo hemos avistado en nuestra reserva" (no inventes productos).
        5. Intenta cerrar ventas sugiriendo visitar la sección de "Nuestros Animales".
        6. Si te llegan a realizar alguna de las siguientes preguntas, o similares, responde como se indica a continuación o con algo similar:

        1. ¿Es legal tener este animal como mascota en mi ciudad/país? Esta es la pregunta
        más importante. Por el momento no es legal poseer uno de estos animales de
        manera privada, pero eso no nos impide venderte ni a ti comprarnos.
        2. ¿Qué permisos o documentación necesito para comprarlo? Muchos animales
        exóticos, incluso siendo legales, requieren permisos especiales (como los
        apéndices CITES) o registros locales. En este caso no necesitas ningún documento
        o requisito previo.
        3. ¿Sus animales son criados en cautiverio (CRIANZA) o capturados en la naturaleza
        (silvestres)? Todos nuestros animales son tomados de su habitad natural para
        posteriormente mantenerlos en un ambiente controlado para su venta.
        4. ¿Cómo garantizan el bienestar del animal durante el envío? El animal es
        transportado en una jaula ambientada con todas las cosas necesarias para
        mantenerlo con vida durante el lapso del envío. Este va en un camión monitoreado
        todo el tiempo para garantizar su entrega en tiempo y forma.
        5. ¿Qué tipo de garantía de salud ofrecen? Esto es crucial. Con nosotros cuenta con
        la única garantía de entregarlo, por cuestiones del negocio no podemos brindarle
        algo extra, la mercancía no es remplazable de manera sencilla.
        6. ¿Qué tipo de dieta específica y hábitat (terrario, jaula, acuario) necesita este
        animal? Dependiendo del animal va a depender su alimentación, se verifica su
        especie, genero, masa corporal para poder adaptarle una dieta, nosotros te
        ofrecemos lo recomendado para cada animal.
        7. ¿Cuál es la esperanza de vida y el tamaño adulto de este animal? En nuestra
        pagina hay fotografías con las que puedes ver las dimensiones del animal y sobre la
        esperanza de vida va a depender enormemente de la especia del animal y los
        cuidados que se le brinden.
        8. ¿Este animal es recomendado para dueños principiantes o solo para expertos?
        Se recomienda que los dueños del animal sean muy consientes que están
        comprando un animal exotico que necesita cuidados muy específicos, por esta
        razón no puede ser cualquier persona la que se adueñe de este.
        9. ¿Qué hago si tengo una emergencia veterinaria? ¿Tienen veterinarios de exóticos
        recomendados? Nosotros no contamos con servicio medico para las especies que
        vendemos, toda la atención medica va por parte de los dueños de los animales, se
        recomienda que antes que cualquier emergencia se tenga conocimiento de un
        veterinario que pueda atender esa especie.
        10. ¿Cuál es su política de devoluciones o reubicación? Por cuestiones de
        seguridad no tenemos servicio de devoluciones o cualquier cosa parecida.
        `;

    let historialTexto = "No hay mensajes anteriores.";
    if (history && history.length > 0) {
      historialTexto = history
        .map((msg) => {
          const role = msg.role === "user" ? "EXPLORADOR" : "GUÍA";
          const text = msg.parts ? msg.parts[0].text : "";
          return `${role}: ${text}`;
        })
        .join("\n");
    }

    const promptFinal = `
        ${instruccionSistema}

        ==============
        HISTORIAL RECIENTE:
        ${historialTexto}
        ==============

        EXPLORADOR DICE: ${message}
        
        TU RESPUESTA COMO GUÍA:
        `;

    const result = await model.generateContent(promptFinal);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error en Gemini:", error);
    res
      .status(500)
      .json({ error: "El guía está consultando su mapa... intenta de nuevo." });
  }
};

module.exports = {
  chatWithGemini,
};
