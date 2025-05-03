const db = require('../shared/database');

exports.userBelongsToGroup = async (groupId, userId) => {
    const result = await db.oneOrNone(
        `SELECT 1 FROM group_users WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
    );

    return !!result;
};