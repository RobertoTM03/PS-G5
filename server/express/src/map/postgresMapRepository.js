const db = require('../shared/database');

exports.addMapLocation = async (mapLocation) => {
    const {
        groupId,
        title,
        location,
        createdBy
    } = mapLocation;
    const [latitude, longitude] = location;

    const query = `
        INSERT INTO map_locations (group_id, title, location, created_by)
        VALUES ($1, $2, POINT($3, $4), $5)
        RETURNING id, group_id AS "groupId", title, location[0] AS "latitude", location[1] AS "longitude", created_by AS "createdBy";
    `;

    const result = await db.one(query, [groupId, title, latitude, longitude, createdBy]);

    return {
        id: result.id,
        groupId: result.groupId,
        title: result.title,
        location: [result.latitude, result.longitude],
        createdBy: result.createdBy
    };
};

exports.findById = async (groupId, locationId) => {
    const query = `
        SELECT id, group_id AS "groupId", title, location[0] AS "latitude", location[1] AS "longitude", created_by AS "createdBy"
        FROM map_locations
        WHERE group_id = $1 AND id = $2;
    `;

    return await db.oneOrNone(query, [groupId, locationId]);
};

exports.getMapLocations = async (groupId) => {
    const query = `
        SELECT id, group_id AS "groupId", title, location[0] AS "latitude", location[1] AS "longitude", created_by AS "createdBy"
        FROM map_locations
        WHERE group_id = $1
        ORDER BY id ASC;
    `;

    return await db.any(query, [groupId]);
};

exports.userBelongsToGroup = async (groupId, userId) => {
    const query = `
        SELECT 1 FROM group_users
        WHERE group_id = $1 AND user_id = $2;
    `;

    const result = await db.oneOrNone(query, [groupId, userId]);
    return !!result;
};

exports.isGroupOwner = async (groupId, userId) => {
    const query = `
        SELECT 1 FROM groups
        WHERE id = $1 AND user_owner_id = $2;
    `;

    const result = await db.oneOrNone(query, [groupId, userId]);
    return !!result;
};
