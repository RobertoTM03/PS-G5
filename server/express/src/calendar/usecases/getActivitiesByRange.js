const activityRepository = require('../activityRepository');
const { isValidISODate } = require("../calendarUtils");

module.exports = async (groupId, startDate, endDate, userId) => {
    if (!isValidISODate(startDate) || !isValidISODate(endDate)) {
        const error = new Error('Dates must be valid. Expected format: YYYYY-MM-DD');
        error.status = 400;
        throw error;
    }

    if (new Date(startDate) > new Date(endDate)) {
        const error = new Error('The start date cannot be later than the end date.');
        error.status = 400;
        throw error;
    }

    return await activityRepository.findByRange(groupId, startDate, endDate);
};
