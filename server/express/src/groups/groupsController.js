const db = require("../database");
const admin = require('../auth/firebase');
const axios = require('axios');

// Función auxiliar para obtener el usuario desde el token Firebase
const getUserFromToken = async (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token de autorización faltante o inválido');
    }

    const idToken = authHeader.split(' ')[1];

    // Verificar el token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Buscar al usuario en la base de datos usando el firebase_uid
    const user = await db.oneOrNone('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    return user;
};

exports.createGroup = async (req, res) => {
    const { titulo, descripcion } = req.body;

    // Validación del título
    if (!titulo || typeof titulo !== 'string' || titulo.length < 1 || titulo.length > 64) {
        return res.status(400).json({ msg: 'El título es obligatorio y debe tener entre 1 y 64 caracteres' });
    }

    try {
        // Obtener el usuario autenticado desde el token
        const user = await getUserFromToken(req.headers.authorization);

        // Crear el grupo
        const group = await db.one(
            `INSERT INTO groups (name, description, idPropietary)
             VALUES ($1, $2, $3) RETURNING id`,
            [titulo, descripcion || '', user.id]
        );

        // Agregar al creador como miembro del grupo
        await db.none(
            `INSERT INTO group_users (group_id, user_id)
             VALUES ($1, $2)`,
            [group.id, user.id]
        );

        res.status(201).json({ groupId: group.id });
    } catch (err) {
        console.error('Error al crear el grupo:', err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.addGroupMember = async (req, res) => {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: 'Email requerido' });

    try {
        const requestingUser = await getUserFromToken(req.headers.authorization);

        // Verificamos que el grupo exista y que el usuario autenticado sea el propietario
        const group = await db.oneOrNone('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (!group) return res.status(404).json({ msg: 'Grupo no encontrado' });

        if (group.idpropietary !== requestingUser.id) {
            return res.status(403).json({ msg: 'No tienes permisos para añadir usuarios a este grupo' });
        }

        // Verificar que el usuario a añadir existe
        const userToAdd = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        if (!userToAdd) return res.status(404).json({ msg: 'Usuario no registrado' });

        // Verificar que no esté ya en el grupo
        const alreadyInGroup = await db.oneOrNone(
            'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, userToAdd.id]
        );
        if (alreadyInGroup) {
            return res.status(400).json({ msg: 'El usuario ya es miembro del grupo' });
        }

        // Añadir al usuario al grupo
        await db.none(
            'INSERT INTO group_users (group_id, user_id) VALUES ($1, $2)',
            [groupId, userToAdd.id]
        );

        res.status(200).json({ msg: 'Usuario añadido exitosamente al grupo' });
    } catch (err) {
        console.error('Error al añadir miembro al grupo:', err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.removeGroupMember = async (req, res) => {};
exports.removeGroup = async (req, res) => {};
exports.getGroupDetails = async (req, res) => {};
exports.leaveGroup = async (req, res) => {};
exports.getMyGroups = async (req, res) => {};