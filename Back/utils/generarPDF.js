const puppeteer = require('puppeteer');

async function generarNotaPDF(datosCompra) {
  
  // Funcion para que se vea bonito el dinero
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor || 0);
  };

  // Crear el HTML 
  const htmlNota = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', Arial, sans-serif; margin: 40px; color: #333; }
          
          /* Encabezado */
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4C5F41; padding-bottom: 20px; }
          .logo { width: 120px; margin-bottom: 10px; }
          .empresa-nombre { font-size: 26px; font-weight: bold; color: #4C5F41; margin: 5px 0; }
          .empresa-lema { font-style: italic; font-size: 14px; color: #666; margin-top: 0; }
          
          /* Información del Cliente y Pedido */
          .info-box { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px; }
          .info-col h3 { margin-top: 0; font-size: 16px; color: #4C5F41; }
          .info-col p { margin: 3px 0; font-size: 14px; }

          /* Tabla de Productos */
          .tabla { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
          .tabla th { background-color: #4C5F41; color: white; padding: 10px; text-align: left; }
          .tabla td { border-bottom: 1px solid #ddd; padding: 10px; }
          .tabla tr:nth-child(even) { background-color: #f2f2f2; }
          
          /* Totales */
          .total-container { width: 50%; float: right; margin-top: 20px; }
          .fila-total { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
          .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; color: #4C5F41; }
          
          /* Pie de página */
          .footer { clear: both; margin-top: 60px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        
        <div class="header">
          <img src="${datosCompra.logoUrl}" class="logo">
          <h1 class="empresa-nombre">ExZooTic</h1>
          <p class="empresa-lema">"Donde lo extraordinario encuentra un hogar"</p>
        </div>

        <div class="info-box">
          <div class="info-col">
            <h3>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${datosCompra.cliente.nombre}</p>
            <p><strong>Email:</strong> ${datosCompra.cliente.email}</p>
            <p><strong>Dirección:</strong> ${datosCompra.cliente.direccion || 'N/A'}</p>
          </div>
          <div class="info-col" style="text-align: right;">
            <h3>Detalles de la Orden</h3>
            <p><strong>Orden #:</strong> ${datosCompra.id}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-MX')}</p>
            <p><strong>Hora:</strong> ${new Date().toLocaleTimeString('es-MX')}</p>
          </div>
        </div>

        <table class="tabla">
          <thead>
            <tr> 
              <th>Producto</th> 
              <th style="text-align: center;">Cant.</th> 
              <th style="text-align: right;">Precio Unit.</th> 
              <th style="text-align: right;">Importe</th> 
            </tr>
          </thead>
          <tbody>
            ${datosCompra.productos.map(p => `
              <tr>
                <td>${p.nombre}</td>
                <td style="text-align: center;">${p.cantidad}</td>
                <td style="text-align: right;">${formatoMoneda(p.precio)}</td>
                <td style="text-align: right;">${formatoMoneda(p.precio * p.cantidad)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-container">
          <div class="fila-total">
            <span>Subtotal:</span>
            <span>${formatoMoneda(datosCompra.subtotal)}</span>
          </div>
          
          <div class="fila-total">
            <span>Impuestos:</span>
            <span>${formatoMoneda(datosCompra.impuestos)}</span>
          </div>

          <div class="fila-total">
            <span>Gastos de Envío:</span>
            <span>${formatoMoneda(datosCompra.envio)}</span>
          </div>

          ${datosCompra.descuento > 0 ? `
            <div class="fila-total" style="color: green;">
              <span>Cupón de Descuento:</span>
              <span>- ${formatoMoneda(datosCompra.descuento)}</span>
            </div>
          ` : ''}

          <div class="fila-total total-final">
            <span>Total General:</span>
            <span>${formatoMoneda(datosCompra.totalGeneral)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Gracias por tu compra. Si tienes dudas contacta a exzootic2@gmail.com</p>
        </div>

      </body>
    </html>
  `;

  // Lanzar Puppeteer y generar PDF
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', 
      '--single-process', 
      '--no-zygote'
      ] 
  }); 
  const page = await browser.newPage();
  
  await page.setContent(htmlNota, { waitUntil: 'domcontentloaded' });
  const pdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generarNotaPDF };