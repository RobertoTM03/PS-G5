const Activity = require('../entities/Activity');
const activityRepository = require('../activityRepository');
const {isValidISODateTime} = require("../../auxiliary-functions");

module.exports = async (groupId, data, userId) => {
    const { title, description, startDate, endDate, location } = data;

    if (!title || !startDate || !endDate) {
        const error = new Error('Missing required fields: title, startDate, and endDate are mandatory.');
        error.status = 400;
        throw error;
    }

    if (!isValidISODateTime(startDate) || !isValidISODateTime(endDate)) {
        const error = new Error('Dates must be in ISO format (YYYYY-MM-DDTHH:MM:SS.sssZ)');
        error.status = 400;
        throw error;
    }

    const newActivity = new Activity({
        groupId,
        title,
        description,
        location,
        startDate,
        endDate,
        createdBy: userId,
        participants: [userId],
    });

    const createdActivity = await activityRepository.create(newActivity);
    return createdActivity;
};
