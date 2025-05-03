const db = require("../shared/database");

exports.isGroupOwner = async (groupId, userId) => {
    const result = await db.oneOrNone(
        `SELECT 1 FROM groups WHERE id = $1 AND user_owner_id = $2`,
        [groupId, userId]
    );
    return !!result;
};

exports.isGroupMember = async (groupId, userId) => {
    const result = await db.oneOrNone(
        `SELECT 1 FROM group_users WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
    );
    return !!result;
};


exports.throwIfNotGroupMember = async (groupId, userId) => {
    if (!(await this.isGroupMember(groupId, userId))) throw new PermissionDeniedError;
}