const admin = require('./firebase');
const axios = require('axios');

const pgp = require('pg-promise')();
const db = pgp(dbConnection);


exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Falta campos requeridos' });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Formato de email no válido' });
    }

    // Validación de longitud de la contraseña
    if (password.length < 8 || password.length > 32) {
        return res.status(422).json({ msg: 'La contraseña debe tener más de 8 y menos de 32 caracteres' });
    }

    try {
        // Verificar si el email existe:
        const emailExists = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
        if (emailExists) {
            return res.status(409).json({ msg: 'El email ya está registrado' });
        }

        // Verificar si el nombre existe:
        const nameExists = await db.oneOrNone('SELECT id FROM users WHERE name = $1', [name]);
        if (nameExists) {
            return res.status(409).json({ msg: 'El nombre de usuario ya está en uso' });
        }

        // Crear usuario en Firebase Auth
        const newUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        });

        // Insertar usuario en PostgreSQL
        await db.none(
            'INSERT INTO users (name, email, firebase_uid) VALUES ($1, $2, $3)',
            [name, email, newUser.uid]
        );

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
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }

    // Validación de longitud de la contraseña
    if (password.length < 8 || password.length > 32) {
        return res.status(400).json({ msg: 'La contraseña debe tener más de 8 y menos de 32 caracteres' });
    }

    try {
        // Buscar al usuario en la base de datos por email o nombre
        const user = await db.oneOrNone(
            'SELECT * FROM users WHERE email = $1 OR name = $1',
            [identifier]
        );

        if (!user) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' }); // Credenciales incorrectas (email o nombre)
        }

        // Usar el email de la base de datos para loguear en Firebase
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email: user.email,
            password: password,
            returnSecureToken: true
        });

        // Devolver el token
        res.status(200).json({
            token: response.data.idToken,
        });

    } catch (err) {
        console.error(err?.response?.data || err.message);
        res.status(401).json({ msg: 'Credenciales incorrectas' });
    }
};


const nodemailer = require('nodemailer');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email requerido' });

    try {
        const link = await admin.auth().generatePasswordResetLink(email, {
            url: 'http://localhost:5173/PasswordRecover',
            handleCodeInApp: true
        });

        // Configura el transportador de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Opciones del correo
        const mailOptions = {
            from: `"TripCollab" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Recupera tu contraseña en TripCollab',
            html: `
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña en TripCollab. Haz clic en el enlace de abajo para continuar:</p>
                <a href="${link}">Restablecer contraseña</a>
                <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
            `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Se ha enviado el correo de recuperación' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error al generar o enviar el enlace' });
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

