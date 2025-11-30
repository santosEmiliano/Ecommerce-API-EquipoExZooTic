// Importamos las librerias necesarias para mandar el correo
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Importamos el model del cupon
const cuponModel = require('../model/cuponModel');

// Configuracion del transporter 
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Funcion para el correo de suscripcion 
const enviarCorreoSub = async (req, res) => {
    const {email} = req.body;

    // Validacion de envio de correo
    if (!email) return res.status(400).json({ message: "El correo no fue recibido" });

    try{
        // Obtenemos un cupon al azar
        const cupon = await cuponModel.getCuponRandom();

        if (!cupon){
            return res.status(600).json({ message: "Ni hay cupones en la base de datos"});
        }

        // Ruta para las imagenes 
        const rutaImagen = path.join(__dirname, '../media', cupon.imagen);

        // Verificamos que exista la imagen en el back
        let archivos = []; 
        let htmlImagen = '';

        if (fs.existsSync(rutaImagen)) {
            archivo = [{
                filename: 'Cupon-ExZooTic.jpg',
                path: rutaImagen,
                cid: 'cupon_img_random' // id para el html
            }];

            htmlImagen = `<img src="cid:cupon_img_random" alt="Cupon de descuento" style="width: 100%; max-width: 600px; border-radius: 8px;"/>`;
        } else {
            console.log("Error: No se encontro la imagen en la ruta:", rutaImagen);
        }

        // Estructuracion del correo
        const mailOptions = {
            from: `"ExZooTic -  Comunidad <${process.env.GMAIL_USER}`,
            to: email,
            subject:  "¡Bienvenido! Aquí tienes tu cupon de regalo 😋🎁",
            html: `
                <div style="font-family: A'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; text-align: center;">
                    <h1 style="color: #4C5F41;">¡Gracias por unirte a la manada!</h1>
                    <p>Estamos felices de tenerte aquí. Como bienvenida, te regalamos este cupón especial.</p>
                    
                    <div style="margin: 20px 0;">
                        ${htmlImagen}
                    </div>

                    <p>Usa el código: <strong style="font-size: 20px; color: #E67E22;">${cupon.codigo}</strong></p>
                    <p>Obtendrás un <strong>${cupon.descuento * 100}%</strong> de descuento.</p>
                    
                    <hr>
                    <small>Atte: El equipo de ExZooTic</small>
                </div>
            `,
            attachments: archivos
        };

        // Enviamos el correo
        await transporter.sendMail(mailOptions);
        res({ status: "success", message: "Correo de suscripcion enviado", cupon:cupon.codigo });
    } catch (error) {
        console.log("Error en el envio de la suscripcion", error);
        res.status(500).json({ status: "error", message: "Error al enviar correo" });
    }  
};