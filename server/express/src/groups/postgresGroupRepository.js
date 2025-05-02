const db = require("../database");

exports.isGroupOwner = async (groupId, userId) => {
    const result = await db.oneOrNone(
        `SELECT 1 FROM groups WHERE id = $1 AND user_owner_id = $2`,
        [groupId, userId]
    );
    return !!result;
};