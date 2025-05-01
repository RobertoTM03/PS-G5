const activityRepository = require('../activityRepository');
const { isValidISODateTime } = require('../../auxiliary-functions');
const {isGroupOwner} = require("../../groups/groupRepository");

module.exports = async (groupId, activityId, updateData, userId) => {
    const activity = await activityRepository.findById(groupId, activityId);
    if (!activity) {
        const error = new Error('Activity not found');
        error.status = 404;
        throw error;
    }

    const isCreator = activity.createdBy === userId;
    const isAdmin = await isGroupOwner(groupId, userId);

    if (!isCreator && !isAdmin) {
        const error = new Error('You do not have permission to modify this activity');
        error.status = 403;
        throw error;
    }

    const { startDate, endDate } = updateData;

    if (startDate && !isValidISODateTime(startDate)) {
        const error = new Error('The start date is not valid. Expected format: YYYYY-MM-DDTHH:MM:SS.sssZ');
        error.status = 400;
        throw error;
    }

    if (endDate && !isValidISODateTime(endDate)) {
        const error = new Error('The start date is not valid. Expected format: YYYYY-MM-DDTHH:MM:SS.sssZ');
        error.status = 400;
        throw error;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        const error = new Error('The start date must be before or equal to the end date.');
        error.status = 400;
        throw error;
    }

    return await activityRepository.update(activityId, updateData);
};
