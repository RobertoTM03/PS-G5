const db = require('../shared/database');

exports.create = async (activityData) => {
    const {
        groupId,
        title,
        description,
        startDate,
        endDate,
        location,
        createdBy
    } = activityData;

    const activity = await db.one(`
        INSERT INTO activities (group_id, title, description, start_date, end_date, location, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `, [groupId, title, description, startDate, endDate, location, createdBy]);

    await db.none(`
        INSERT INTO activity_participants (activity_id, user_id)
        VALUES ($1, $2)
    `, [activity.id, createdBy]);

    return activity;
};

exports.findById = async (groupId, activityId) => {
    const query = `
        SELECT id, group_id AS "groupId", title, description, start_date AS "startDate",
               end_date AS "endDate", location, created_by AS "createdBy"
        FROM activities
        WHERE id = $1 AND group_id = $2
    `;

    return await db.oneOrNone(query, [activityId, groupId]);
};

exports.getParticipants = async (activityId) => {
    const query = `
    SELECT u.id, u.name, u.email
    FROM activity_participants ap
    JOIN users u ON ap.user_id = u.id
    WHERE ap.activity_id = $1
  `;

    return await db.any(query, [activityId]);
};

exports.userBelongsToGroup = async (groupId, userId) => {
    const result = await db.oneOrNone(`
        SELECT 1 FROM group_users
        WHERE group_id = $1 AND user_id = $2
    `, [groupId, userId]);

    return !!result;
};

exports.update = async (activityId, updateData) => {
    const {
        title,
        description,
        startDate,
        endDate,
        location
    } = updateData;

    const query = `
        UPDATE activities
        SET 
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          start_date = COALESCE($3, start_date),
          end_date = COALESCE($4, end_date),
          location = COALESCE($5, location)
        WHERE id = $6
        RETURNING id, group_id AS "groupId", title, description, start_date AS "startDate",
                  end_date AS "endDate", location, created_by AS "createdBy";
    `;

    return await db.one(query, [
        title ?? null,
        description ?? null,
        startDate ?? null,
        endDate ?? null,
        location ?? null,
        activityId
    ]);
};

exports.delete = async (activityId) => {
    await db.none(`
    DELETE FROM activities
    WHERE id = $1
  `, [activityId]);
};

exports.addParticipant = async (activityId, userId) => {
    try {
        await db.none(`
            INSERT INTO activity_participants (activity_id, user_id)
            VALUES ($1, $2)
        `, [activityId, userId]);
    } catch (error) {
        if (error.code === '23505') { // Código de error UNIQUE VIOLATION en PostgreSQL
            const err = new Error('Ya estás unido a esta actividad');
            err.status = 400;
            throw err;
        }
        throw error; // Propagamos otros errores no controlados
    }
};

exports.removeParticipant = async (activityId, userId) => {
    const result = await db.result(`
        DELETE FROM activity_participants
        WHERE activity_id = $1 AND user_id = $2
    `, [activityId, userId]);

    if (result.rowCount === 0) {
        const error = new Error('No estás inscrito en esta actividad');
        error.status = 400;
        throw error;
    }
};

exports.findByDay = async (groupId, date) => {
    const query = `
        SELECT id, group_id AS "groupId", title, description, start_date AS "startDate",
               end_date AS "endDate", location, created_by AS "createdBy"
        FROM activities
        WHERE group_id = $1
          AND start_date::date = $2::date
        ORDER BY start_date ASC;
    `;

    return await db.any(query, [groupId, date]);
};


exports.findByRange = async (groupId, startDate, endDate) => {
    const query = `
        SELECT id, group_id AS "groupId", title, description, start_date AS "startDate",
               end_date AS "endDate", location, created_by AS "createdBy"
        FROM activities
        WHERE group_id = $1
          AND start_date::date BETWEEN $2::date AND $3::date
        ORDER BY start_date ASC;
    `;

    return await db.any(query, [groupId, startDate, endDate]);
};
