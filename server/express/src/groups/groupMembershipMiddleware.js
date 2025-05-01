const groupService = require('./groupService');

module.exports = async (req, res, next) => {
    const groupId = parseInt(req.params.groupId, 10);
    const userId = req.user.id;

    if (isNaN(groupId)) {
        return res.status(400).json({ message: 'El ID del grupo no es válido' });
    }

    try {
        const isMember = await groupService.userBelongsToGroup(groupId, userId);

        if (!isMember) {
            return res.status(403).json({ message: 'No perteneces a este grupo' });
        }

        next();
    } catch (err) {
        console.error('Error en groupMembershipMiddleware:', err);
        res.status(500).json({ message: 'Error al verificar la membresía del grupo' });
    }
};
