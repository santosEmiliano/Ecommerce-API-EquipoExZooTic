// Importamos las librerias necesarias para mandar el correo
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Importamos el model del cupon
const cuponModel = require('../model/cuponModel');

// Importamos el model del userModel
const userModel = require("../model/userModel");

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
    // Obtenciun de datos del body
    const {email} = req.body;

    const userId = req.userId;

    // Validacion de envio de datos para el correo
    if (!email) return res.status(400).json({ message: "El correo no fue recibido" });

    try{
        const user = await userModel.buscarId(userId);

        if(!user){
            return res.status(404).json({message: "Usuario no encontrado."});
        }

        // Validacion para saber si ya esta suscrito
        if(user.suscripcion == 1){
            return res.status(400).json({message: "Ya eres parte de la manada. NO PUEDES SUSCRIBIRTE"});
        }

        // Obtenemos un cupon al azar
        const cupon = await cuponModel.getCuponRandom();

        if (!cupon){
            return res.status(500).json({ message: "Ni hay cupones en la base de datos"});
        }

        // Ruta para las imagenes 
        const rutaLogo = path.join(__dirname, '../media/logo.png'); // Logo
        const rutaCupon = path.join(__dirname, '../media', cupon.imagen); // Cupon

        // Variables para los archivos a enviar e imagenes
        let archivos = []; 
        let htmlLogo = ''
        let htmlCupon = '';

        // Procesamos el logo
        if (fs.existsSync(rutaLogo)) {
            archivos.push({
                filename: 'Logo-ExZooTic.jpg',
                path: rutaLogo,
                cid: 'logo_ExZooTic_img' // Id para el html del logo
            });

            htmlLogo = `<img src="cid:logo_ExZooTic_img" alt="ExZooTic" style="width: 100px; margin-bottom: 10px;"/>`;
        }

        // Procesamos el cupon
        if (fs.existsSync(rutaCupon)) {
            archivos.push({
                filename: 'Cupon-ExZooTic.jpg',
                path: rutaCupon,
                cid: 'cupon_img_random' // id para el html del cupon
            });

            htmlCupon = `<img src="cid:cupon_img_random" alt="Cupon de descuento" style="width: 100%; max-width: 600px; border-radius: 8px;"/>`;
        } else {
            console.log("Error: No se encontraron las imagenes en la rutas:", rutaCupon, rutaLogo);
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

                    <p style="background-color: #f4f9f4; padding: 10px; display: inline-block; border-radius: 5px; border: 1px dashed #4C5F41;">Código para canjear: <strong style="font-size: 18px; color: #E67E22;">${cupon.codigo}</strong></p>

                    <br><br>
                    <small style="color: #999;">Este correo fue enviado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}</small>
                </div>
            `,
            attachments: archivos
        };

        // Enviamos el correo
        await transporter.sendMail(mailOptions);

        await userModel.userSuscrito(userId);
        
        res.json({ status: "success", message: "Correo de suscripcion enviado", cupon:cupon.codigo });
    } catch (error) {
        console.log("Error en el envio de la suscripcion", error);
        res.status(500).json({ status: "error", message: "Error al enviar correo" });
    }  
};

const enviarCorreoContacto = async (req, res) =>{
    // Obtenciun de datos del body
    const {nombre, email, mensaje} = req.body;
    
    // Validacion de envio de datos para el correo
    if(!email || !nombre) return res.status(400).json({ message: "Faltan datos obligatorios para el correo"});

    try{
        // Ruta de la imagen
        const rutaLogo = path.join(__dirname, '../media/logo.png'); // Logo

        // Variables para los archivos a enviar e imagenes
        let archivos = [];
        let htmlLogo = '';

         // Procesamos el logo
         if (fs.existsSync(rutaLogo)) {
            archivos = [{
                filename: 'Logo-ExZooTic.jpg',
                path: rutaLogo,
                cid: 'logo_ExZooTic_img' // Id para el html del logo
            }]

            htmlLogo = `<img src="cid:logo_ExZooTic_img" alt="ExZooTic" style="width: 100px; margin-bottom: 10px;"/>`;
        }

        // Se que esto lo pide validar en la computadora y la hora de envio del correo pero lo agrego
        const fechaEnvio = new Date().toLocaleDateString('es-MX');
        const horaEnvio = new Date().toLocaleTimeString('es-MX');

        // Estructuracion del correo
        const mailOptions = {
            from: `"ExZooTic - Soporte" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Hemos recibido tu mensaje explorador 🐾",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    ${htmlLogo}

                    <h1 style="color: #4C5F41; font-family: 'Trebuchet MS', sans-serif; margin: 5px 0;">ExZooTic</h1>
                    <p style="font-style: italic; color: #777; font-size: 14px; margin-top: 0;">"Donde lo extraordinario encuentra un hogar"</p>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                    <h2 style="color: #333;">Hola, ${nombre}</h2>
                    <p style="font-size: 18px; font-weight: bold; color: #E67E22; background-color: #fff3cd; padding: 10px; border-radius: 5px;">En breve será atendido</p>
                    <p style="font-size: 16px;">Hemos recibido tu mensaje correctamente:</p>
                    
                    <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4C5F41; text-align: left; font-style: italic; color: #555;">
                        "${mensaje}"
                    </blockquote>

                    <br>

                    <small style="color: #999;">
                        Mensaje enviado el: <strong>${fechaEnvio}</strong> a las <strong>${horaEnvio}</strong>
                    </small>
                </div>
            `,

            attachments: archivos
        };

        // Enviamos el correo
        await transporter.sendMail(mailOptions);
        res.json({status: "success", message: "Correo de contacto enviado"});
    } catch (error){
        console.error("Error enviando contacto:", error);
        res.status(500).json({ status: "error", message: "Error al enviar correo de contacto" });
    }
}
module.exports = {
    enviarCorreoSub,
    enviarCorreoContacto
};