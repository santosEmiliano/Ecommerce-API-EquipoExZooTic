const puppeteer = require('puppeteer');

async function generarNotaPDF(datosCompra) {
  //Crear el HTML 
  const htmlNota = `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; margin: 40px; }
          h1 { color: #333; }
          .logo { width: 100px; }
          .tabla { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .tabla th, .tabla td { border: 1px solid #ddd; padding: 8px; }
          .tabla th { background-color: #f2f2f2; }
          .total { text-align: right; margin-top: 20px; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <img src="${datosCompra.logoUrl}" class="logo">
        <h1>Nota de Compra #${datosCompra.id}</h1>
        <p>Fecha: ${new Date().toLocaleDateString()}</p>
        <p>Cliente: ${datosCompra.cliente.nombre}</p>
        
        <table class="tabla">
          <thead>
            <tr> <th>Producto</th> <th>Cantidad</th> <th>Precio Unitario</th> </tr>
          </thead>
          <tbody>
            ${datosCompra.productos.map(p => `
              <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          <p>Subtotal: $${datosCompra.subtotal.toFixed(2)}</p>
          <p>Envío: $${datosCompra.envio.toFixed(2)}</p>
          <p><strong>Total: $${datosCompra.totalGeneral.toFixed(2)}</strong></p>
        </div>
      </body>
    </html>
  `;

  // Lanzar Puppeteer y generar PDF
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox'] 
  }); 
  const page = await browser.newPage();
  
  await page.setContent(htmlNota, { waitUntil: 'domcontentloaded' });
  const pdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generarNotaPDF };