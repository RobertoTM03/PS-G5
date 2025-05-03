const db = require("../shared/database");
const { getUserFromToken } = require("../auth/authService")

exports.createGroup = async (req, res) => {
    const { titulo, descripcion } = req.body;

    // Validación del título
    if (!titulo || typeof titulo !== 'string' || titulo.length < 1 || titulo.length > 64) {
        return res.status(400).json({
            msg: 'El título es obligatorio y debe tener entre 1 y 64 caracteres'
        });
    }

    try {
        // Obtener el usuario autenticado desde el token
        const user = await getUserFromToken(req.headers.authorization);

        // Crear el grupo
        const group = await db.one(
            `INSERT INTO groups (name, description, user_owner_id)
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
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al crear el grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};

exports.addGroupMember = async (req, res) => {
    const { groupId } = req.params;
    const { email } = req.body;

    // Validación del email
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ msg: 'Email requerido o inválido' });
    }

    try {
        // Obtener usuario autenticado desde el token
        const requestingUser = await getUserFromToken(req.headers.authorization);

        // Verificar existencia del grupo
        const group = await db.oneOrNone('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (!group) {
            return res.status(404).json({ msg: 'Grupo no encontrado' });
        }

        // Verificar que sea el propietario
        if (group.user_owner_id !== requestingUser.id) {
            return res.status(403).json({ msg: 'No tienes permisos para añadir usuarios a este grupo' });
        }

        // Verificar existencia del usuario a añadir
        const userToAdd = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        if (!userToAdd) {
            return res.status(404).json({ msg: 'Usuario no registrado' });
        }

        // Verificar si ya es miembro del grupo
        const alreadyInGroup = await db.oneOrNone(
            'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, userToAdd.id]
        );
        if (alreadyInGroup) {
            return res.status(400).json({ msg: 'El usuario ya es miembro del grupo' });
        }

        // Añadir usuario al grupo
        await db.none(
            'INSERT INTO group_users (group_id, user_id) VALUES ($1, $2)',
            [groupId, userToAdd.id]
        );

        res.status(200).json({ msg: 'Usuario añadido exitosamente al grupo' });
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al añadir miembro al grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};

exports.removeGroupMember = async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;

    // Validación del userId
    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ msg: 'userId requerido o inválido' });
    }

    try {
        // Obtener el usuario autenticado desde el token
        const requestingUser = await getUserFromToken(req.headers.authorization);

        // Verificar existencia del grupo
        const group = await db.oneOrNone('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (!group) {
            return res.status(404).json({ msg: 'Grupo no encontrado' });
        }

        // Verificar si el solicitante es el propietario del grupo
        if (group.user_owner_id !== requestingUser.id) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar usuarios de este grupo' });
        }

        // Verificar existencia del usuario a eliminar
        const userToRemove = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);
        if (!userToRemove) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // No se puede eliminar al administrador del grupo
        if (userToRemove.id === group.user_owner_id) {
            return res.status(400).json({ msg: 'No puedes eliminar al administrador del grupo' });
        }

        // Verificar que el usuario sea miembro del grupo
        const isMember = await db.oneOrNone(
            'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, userId]
        );
        if (!isMember) {
            return res.status(400).json({ msg: 'El usuario no es miembro del grupo' });
        }

        // Eliminar al usuario del grupo
        await db.none(
            'DELETE FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, userId]
        );

        res.status(200).json({ msg: 'Usuario eliminado exitosamente del grupo' });
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al eliminar miembro del grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};

exports.removeGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Obtener el usuario autenticado desde el token
        const requestingUser = await getUserFromToken(req.headers.authorization);

        // Verificar que el grupo exista
        const group = await db.oneOrNone('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (!group) {
            return res.status(404).json({ msg: 'Grupo no encontrado' });
        }

        // Verificar que el solicitante sea el propietario del grupo
        if (group.user_owner_id !== requestingUser.id) {
            return res.status(403).json({ msg: 'No tienes permisos para eliminar este grupo' });
        }

        // Eliminar todos los miembros del grupo (opcional si tienes ON DELETE CASCADE)
        await db.none('DELETE FROM group_users WHERE group_id = $1', [groupId]);

        // Eliminar el grupo
        await db.none('DELETE FROM groups WHERE id = $1', [groupId]);

        res.status(200).json({ msg: 'Grupo eliminado exitosamente' });
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al eliminar el grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};

exports.getGroupDetails = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Obtener el usuario autenticado desde el token
        const user = await getUserFromToken(req.headers.authorization);

        // Verificar que el grupo exista
        const group = await db.oneOrNone('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (!group) {
            return res.status(404).json({ msg: 'No se pudieron cargar los detalles del grupo' });
        }

        // Verificar que el usuario sea miembro del grupo
        const isMember = await db.oneOrNone(
            'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, user.id]
        );
        if (!isMember) {
            return res.status(403).json({ msg: 'No tienes permiso para ver los detalles de este grupo' });
        }

        // Obtener los integrantes del grupo
        const integrantes = await db.any(
            `SELECT u.id AS "userId", u.name AS "nombre", u.email
             FROM users u
             INNER JOIN group_users gu ON gu.user_id = u.id
             WHERE gu.group_id = $1`,
            [groupId]
        );

        // Responder con los detalles del grupo
        res.status(200).json({
            isOwner: user.id == group.user_owner_id,
            titulo: group.name,
            descripcion: group.description,
            integrantes
        });
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al obtener detalles del grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};

exports.leaveGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Obtener usuario autenticado desde el token
        const user = await getUserFromToken(req.headers.authorization);

        // Verificar que el grupo exista
        const group = await db.oneOrNone('SELECT * FROM groups WHERE id = $1', [groupId]);
        if (!group) {
            return res.status(404).json({ msg: 'Grupo no encontrado' });
        }

        // Verificar si el usuario es el propietario (no puede salir del grupo)
        if (group.user_owner_id === user.id) {
            return res.status(400).json({ msg: 'El administrador no puede salir del grupo' });
        }

        // Verificar si el usuario es miembro del grupo
        const isMember = await db.oneOrNone(
            'SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, user.id]
        );
        if (!isMember) {
            return res.status(404).json({ msg: 'No perteneces a este grupo' });
        }

        // Eliminar al usuario del grupo
        await db.none(
            'DELETE FROM group_users WHERE group_id = $1 AND user_id = $2',
            [groupId, user.id]
        );

        res.status(200).json({ msg: 'Saliste del grupo exitosamente' });
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al salir del grupo:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};

exports.getMyGroups = async (req, res) => {
    try {
        // Obtener el usuario autenticado desde el token (la validación se maneja dentro de getUserFromToken)
        const user = await getUserFromToken(req.headers.authorization);

        // Consultar los grupos donde el usuario es propietario o miembro
        const grupos = await db.any(
            `
                SELECT DISTINCT
                    g.id AS "groupId",
                    g.name AS "titulo",
                    g.description AS "descripcion"
                FROM groups g
                         LEFT JOIN group_users gu ON g.id = gu.group_id
                WHERE g.user_owner_id = $1 OR gu.user_id = $1
            `,
            [user.id]
        );

        if (!grupos || grupos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron grupos asociados al usuario' });
        }

        res.status(200).json(grupos);
    } catch (err) {
        if (err.statusCode === 401) {
            return res.status(401).json({ msg: err.message });
        }

        console.error('Error al obtener mis grupos:', err);
        res.status(500).json({ msg: 'Error no definido' });
    }
};
