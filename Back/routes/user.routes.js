const express = require("express");
const router = express.Router();

const usersFuncion = require("../controllers/user.controller");

const tokens = require("../middleware/verifyToken");
const { datosToken } = require("../controllers/token.controller");

router.post("/login", usersFuncion.login);
/*
 try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: "as",//cambialos!
                    contrasena: "soyAdmin"
                })
            });
            if (!response.ok) {
                throw new Error("Error en el login: " + response.status);
            }
            const data = await response.json();
            console.log("Token:", data.token);//TOKEN!!!!!! GUDARDALO
            console.log(data);//todos los datos!!!
            //console.log(data.datos);//datos de el usuario
            console.log(data.datos.id);//TAMBIEN GUARDALO ES IMPORTANTE
            console.log(data.datos.nombre);//nombre
            console.log(data.datos.admin);//0 o 1 en  STRING
            console.log(data.datos.correo);
            console.log(data.datos.pais);
            console.log(data.datos.suscripcion);// 0 o 1 en STRING
            
        } catch (error) {
            console.error("Error al intentar logear:", error);
        }
    }
*/

router.post("/obtenerDatos", tokens.verifyToken, datosToken);

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

//ruta log out
router.post("/logOut", tokens.verifyToken, usersFuncion.logOut);

//crear usuario
router.post("/usuario", usersFuncion.createUser);

/*
async function crearUsuario() {
    try {
        const response = await fetch("http://localhost:3000/usuario", {//fetchito
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: "Daniel",
                correo: "daniel@example.com",
                contrasena: "123456",
                pais: "México"
            })
        });
        if (!response.ok) {
            throw new Error("Error en la petición: " + response.status);
        }
        const data = await response.json();
        console.log("Respuesta del servidor:", data);//quitar eszto si no lo kieres
        console.log(data.token);//guardar!!!
        console.log(data.id);//guardar!!!
    } catch (error) {
        console.error("Error al crear usuario:", error);
    }
}
*/

module.exports = router;
