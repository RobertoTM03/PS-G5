const admin = require('./firebase');
const axios = require('axios');
const db = require("../database");
const { getUserFromToken } = require("../auxiliary-functions")

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Faltan campos requeridos' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Formato de email no válido' });
    }

    if (password.length < 8 || password.length > 32) {
        return res.status(422).json({ msg: 'La contraseña debe tener entre 8 y 32 caracteres' });
    }

    let newUser = null;
    try {
        const emailExists = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
        if (emailExists) return res.status(409).json({ msg: 'El email ya está registrado' });

        const nameExists = await db.oneOrNone('SELECT id FROM users WHERE name = $1', [username]);
        if (nameExists) return res.status(409).json({ msg: 'El nombre de usuario ya está en uso' });

        // Crear el usuario en Firebase
        newUser = await admin.auth().createUser({
            email,
            password,
            displayName: username,
        });

        // Registrar el usuario en la base de datos
        await db.none(
            'INSERT INTO users (name, email, firebase_uid) VALUES ($1, $2, $3)',
            [username, email, newUser.uid]
        );

        // Obtener el ID Token logueando al usuario
        const firebaseRes = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        // Devolver el ID Token
        res.status(201).json({ token: firebaseRes.data.idToken });

    } catch (err) {
        console.error('Error en el registro:', err);
        // Limpieza si falló después de crear el usuario en Firebase
        if (newUser?.uid) {
            await admin.auth().deleteUser(newUser.uid);
        }
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

        try {
            const firebaseRes = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
                {
                    email: user.email,
                    password: password,
                    returnSecureToken: true
                }
            );
            res.status(200).json({ token: firebaseRes.data.idToken });
        } catch (err) {
            console.error('Error al loguear:', err.response?.data || err.message);
            res.status(401).json({ msg: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error(err?.response?.data || err.message);
        res.status(401).json({ msg: 'Credenciales incorrectas' });
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
        console.log(`Password reset requested[${res.status}]: ${res}`);
        res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
    } catch (err) {
        console.log(err);
        if (err.response.status == 400) {
            res.status(400).json({ msg: 'Código de reestablecimiento expirado' });
        } else {
            res.status(500).json({ msg: 'Error al cambiar la contraseña' });
        }
    }
};

exports.getMyInformation = async (req, res) => {
    try {
        // Obtener el usuario autenticado desde el token
        const user = await getUserFromToken(req.headers.authorization);

        // Responder con los detalles del grupo
        res.status(200).json({
            name: user.name,
            email: user.email,
            id: user.id
        });
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al obtener detalles del grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};
