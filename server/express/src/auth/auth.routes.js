const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getMyInformation } = require('./authController');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite al usuario iniciar sesión con sus credenciales y recibir un token
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Nombre de usuario o email
 *                 example: prueba@mail.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: Secreta123
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve el token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Faltan campos obligatorios o formato inválido
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error no definido
 */
router.post('/login', login);


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
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar restablecer contraseña
 *     description: Permite a un usuario solicitar el restablecimiento de su contraseña
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico registrado
 *                 example: prueba@mail.com
 *     responses:
 *       200:
 *         description: Se ha enviado un correo con instrucciones (aunque el email no esté registrado, por seguridad no se informa)
 *       400:
 *         description: Falta el campo email o es inválido
 *       500:
 *         description: Error no definido
 */
router.post('/forgot-password', forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
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
router.post('/reset-password', resetPassword);

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