const db = require("../database")
const admin = require("../auth/firebase");

exports.getUserFromToken = async (authHeader) => {
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        const error = new Error('Falta el token de autorización o el formato es incorrecto');
        error.status = 401;
        throw error;
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;

        const user = await db.oneOrNone('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
        if (!user) {
            const error = new Error('Usuario no encontrado');
            error.status = 401;
            throw error;
        }

        return user;
    } catch (err) {
        const error = new Error('Token inválido o sesión caducada');
        error.status = 401;
        throw error;
    }
};
