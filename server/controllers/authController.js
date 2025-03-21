const admin = require('../firebase');
const axios = require('axios');

exports.register = async (req, res) => {
    // TODO: Comprobar valores válidos de los campos (cod: 400)
    // TODO: Comprobar email no asignado a otra cuenta (cod: 409)
    // TODO: Comprobar nombre no asignado a otra cuenta (Falta en la HU)
    // TODO: Comprobar que la contraseña no cumple los requisitos de seguridad (cod: 422)


    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Falta campos requeridos' });
    }

    try {
        // Crear usuario en Firebase Auth
        const newUser = await admin.auth().createUser({
            email: name,
            password: email,
            displayName: name,
        });

        // Guardar en base de datos
        /*
            Nombre: name
            Correo: email
            Firebase_uid: newUser.uid
         */

        // Crear un token personalizado
        const customToken = await admin.auth().createCustomToken(newUser.uid);

        // Devolver respuesta
        res.status(201).json({
            token: customToken,
        });

    } catch (err) {
        console.error('Error en el registro:', err);
        res.status(500).json({ msg: 'Error al registrar', error: err.message });
    }
};

exports.login = async (req, res) => {
    // TODO: Comprobar valores válidos de los campos (cod: 400)

    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }

    try {
        // TODO: Buscar en la base de datos por email o nombre y obtener el user.

        if (!user) {
            return res.sendStatus(401); // Credenciales incorrectas (email o nombre)
        }

        // TODO ¿El token se pasa por cabecera o cómo?
        // Usar el email de la base de datos para loguear en Firebase
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email: user.email,
            password: password,
            returnSecureToken: true
        });

        // Devolver el token y datos
        res.status(200).json({
            token: response.data.idToken,
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(401).json({ msg: 'Credenciales incorrectas' });
    }
};


exports.forgotPassword = async (req, res) => {
    // TODO: Comprobar valores válidos de los campos (cod: 400)

    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email requerido' });

    try {
        const link = await admin.auth().generatePasswordResetLink(email, {
            url: 'página_de_restablecer_contraseña',
            handleCodeInApp: true
        });

        // TODO: Enviar el correo de restablecimiento (nodemailer)?

        res.json({ msg: 'Se ha enviado el correo de recuperación', link });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error al generar el enlace' });
    }
};


exports.resetPassword = async (req, res) => {
    const { oobCode, newPassword } = req.body;
    if (!oobCode || !newPassword) return res.status(400).json({ msg: 'Datos incompletos' });

    try {
        await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${process.env.FIREBASE_API_KEY}`, {
            oobCode,
            newPassword
        });

        res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al cambiar la contraseña' });
    }
};

