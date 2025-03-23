

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

function mecagoenRobertoyEnSusMuertos(url){
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }


    } catch (error) {
        console.error(error.message);
    }
}