const express = require('express');
const router = express.Router();
/**
 * @openapi
 * /group/{groupId}/expenses:
 *   get:
 *     summary: Get expense list
 *     description: Allows access to a given group expense list
 *     tags:
 *       - Expenses
 *     responses:
 *       200:
 *         description: Success, returns a list of expenses. Each expense will have a name, an amount and, optionally, a contributor and a list of tags. If the expense doesn't have a contributor, it means it hasn't been covered yet and it accepts adding a contributor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [name, amount]
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Plane tickets"
 *                   amount:
 *                     type: number
 *                     format: float
 *                     description: The expense amount that has been covered or is to be covered. By default the currency is Euros.
 *                     example: 270.00
 *                   contributor:
 *                     type: object
 *                     properties:
 *                         userId:
 *                             type: string
 *                             description: ID of the User that covered the expense
 *                             example: "64ac9b7b5f8e2c001fc45abc"
 *                   tags:
 *                     type: array
 *                     items:
 *                         type: string
 *                         description: Tags associated to the expense
 *                         example: "Trip to Mallorca"
 *       403:
 *         description: Access denied
 *       404:
 *         description: Group not found
 *       500:
 *         description: Something went wrong on our side
 */
router.post('/login', null);


/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Crear una nueva cuenta de usuario
 *     description: Permite a un usuario registrarse en la aplicación creando una nueva cuenta.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: NombrePrueba
 *               email:
 *                 type: string
 *                 description: Correo electrónico único
 *                 example: prueba@mail.com
 *               password:
 *                 type: string
 *                 description: Contraseña segura (8 a 32 caracteres)
 *                 example: Secreta123
 *     responses:
 *       201:
 *         description: Registro exitoso. Devuelve los datos del usuario y el token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Faltan campos obligatorios o no cumplen validaciones
 *       409:
 *         description: Email ya registrado
 *       422:
 *         description: La contraseña no cumple los requisitos de seguridad
 *       500:
 *         description: Error no definido
 */
router.post('/register', register);


/**
 * @openapi
 * /auth/password-reset:
 *   post:
 *     summary: Cambiar la contraseña después de la solicitud de restablecimiento
 *     description: Permite al usuario cambiar su contraseña usando el token de restablecimiento
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: Token recibido por email para validar el cambio
 *                 example: "abc123-reset-token"
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña (8 a 32 caracteres)
 *                 example: NuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       401:
 *         description: Token inválido o expirado
 *       400:
 *         description: Faltan campos o la contraseña no cumple los requisitos
 *       409:
 *         description: La nueva contraseña no puede ser igual a la anterior
 *       500:
 *         description: Error no definido
 */
router.post('/password-reset', resetPassword);


/**
 * @openapi
 * /auth/my-information:
 *   post:
 *     summary: Obtener la información del usuario a travez del token.
 *     security:
 *       - bearerAuth: []
 *     description: Permite a un usuario logueado obtener su información.
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Detalles del usuario cargados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "NombrePrueba"
 *                 email:
 *                   type: string
 *                   example: "prueba@mail.com"
 *                 id:
 *                   type: string
 *                   example: "64ac9b7b5f8e2c001fc45abc"
 *       401:
 *         description: Fallo de autenticación con el token del usuario
 *       500:
 *         description: Error no definido
 */
router.post('/my-information', getMyInformation);


module.exports = router;