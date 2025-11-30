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
        const rutaLogo = path.join(__dirname, '../media/logo.png'); // Logo
        const rutaCupon = path.join(__dirname, '../media', cupon.imagen); // Cupon

        // Verificamos que exista la imagen en el back
        let archivos = []; 
        let htmlLogo = ''
        let htmlCupon = '';

        // Procesamos el logo
        if (fs.existsSync(rutaLogo)) {
            archivos = [{
                filename: 'Logo-ExZooTic.jpg',
                path: rutaLogo,
                cid: 'logo_ExZooTic_img' // Id para el html del logo
            }]

            htmlLogo = `<img src="cid:logo_empresa" alt="ExZooTic" style="width: 100px; margin-bottom: 10px;"/>`;
        }

        // Procesamos el cupon
        if (fs.existsSync(rutaCupon)) {
            archivos = [{
                filename: 'Cupon-ExZooTic.jpg',
                path: rutaImagen,
                cid: 'cupon_img_random' // id para el html del cupon
            }];

            htmlCupon = `<img src="cid:cupon_img_random" alt="Cupon de descuento" style="width: 100%; max-width: 600px; border-radius: 8px;"/>`;
        } else {
            console.log("Error: No se encontro la imagen en la ruta:", rutaImagen);
        }

        // Estructuracion del correo
        const mailOptions = {
            from: `"ExZooTic -  Comunidad <${process.env.GMAIL_USER}`,
            to: email,
            subject:  "¡Bienvenido! Aquí tienes tu cupon de regalo 😋🎁",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    ${htmlLogo}
                    <h1 style="color: #4C5F41; font-family: 'Trebuchet MS', sans-serif; margin: 5px 0;">ExZooTic</h1>
                    <p style="font-style: italic; color: #777; font-size: 14px; margin-top: 0;">"Donde lo extraordinario encuentra un hogar"</p>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                    <h2 style="color: #333;">¡Gracias por unirte a la manada!</h2>
                    <p style="font-size: 16px; line-height: 1.5;">
                        Estamos muy felices de que seas parte de nuestra comunidad de amantes de los animales exóticos. 
                        Como agradecimiento por tu confianza, hemos preparado un regalo especial para tu primera compra.
                    </p>
                    <div style="margin: 20px 0;">
                        ${htmlCupon}
                    </div>

                    <p style="background-color: #f4f9f4; padding: 10px; display: inline-block; border-radius: 5px; border: 1px dashed #4C5F41;">
                        Código para canjear: <strong style="font-size: 18px; color: #E67E22;">${cupon.codigo}</strong>
                    </p>
                    
                    <br><br>
                    <small style="color: #999;">Este correo fue enviado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}</small>
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

module.exports = {
    enviarCorreoSub
};