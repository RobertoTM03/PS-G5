

//Cuando se genera el token se asocia al usuario
//que luego se mete en la base de datos
/**
 * Leer el token desde la URL (GET /reset-password?token=abc123).
 *
 * Consultar en la base de datos si ese token es válido y no ha expirado.
 *
 * Si el token es válido, permitir al usuario cambiar la contraseña.
 *
 * Si no es válido o ha expirado, mostrar un mensaje de error y pedir que solicite otro.
 * Habria que hacer una tabla dinamica
 */

// 1. Verificar que el email existe en la BD de firebase
// 2. Obtener el uid del user y el email
// 3. Cambiar Password

const axios = require("axios");
require("dotenv").config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

// 🔹 Verifica si el código `oobCode` es válido
async function verificarOobCode(oobCode) {
    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`,
            { oobCode }
        );

        return { valido: true, email: response.data.email };
    } catch (err) {
        return { valido: false, error: "Código inválido o expirado" };
    }
}

// 🔹 Cambia la contraseña si el `oobCode` es válido
async function cambiarContraseña(oobCode, newPassword) {
    try {
        await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`,
            { oobCode, newPassword }
        );

        return { msg: " Contraseña actualizada correctamente" };
    } catch (err) {
        return { msg: " Error al cambiar la contraseña" };
    }
}

/**Para el servidor
 * if (req.url === "/verify-oob" && req.method === "POST") {
 *     const { oobCode } = JSON.parse(body);
 *     const resultado = await verificarOobCode(oobCode);
 *     res.writeHead(resultado.valido ? 200 : 400, { "Content-Type": "application/json" });
 *     res.end(JSON.stringify(resultado));
 * }
 *
 * if (req.url === "/reset-password" && req.method === "POST") {
 *     const { oobCode, newPassword } = JSON.parse(body);
 *     const resultado = await cambiarContraseña(oobCode, newPassword);
 *     res.writeHead(200, { "Content-Type": "application/json" });
 *     res.end(JSON.stringify(resultado));
 * }
 */