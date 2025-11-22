const express = require("express");
const router = express.Router();


const usersFuncion=require("../controllers/user.controller");

const tokens=require("../middleware/verifyToken");
const {datosToken}=require("../controllers/tokens.controller");

router.post("/login",usersFuncion.login);
/*
 try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: "alonso@correo.com",//cambialos!
                    contrasena: "soyAlonso123"
                })
            });

            if (!response.ok) {
                throw new Error("Error en el login: " + response.status);
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);
            console.log("Token:", data.token);//TOKEN!!!!!!

        } catch (error) {
            console.error("Error al intentar logear:", error);
        }

*/

router.post("/obtenerDatos",tokens.verifyToken,datosToken);

/*
try {
            
        const response = await fetch("http://localhost:3000/auth/obtenerDatos", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, ///pon el token we
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error obteniendo datos: " + response.status);
        }

        const data = await response.json();
        console.log("Datos del usuario:", data.user);

        //datos del usuario :O
        console.log(data.user.nombre);
        console.log(data.user.correo);
        console.log(data.user.pais);
        console.log(data.user.admin);
        console.log(data.user.suscripcion);


    } catch (error) {
        console.error("Error:", error);
    }
    }
*/
module.exports = router;