const activityRepository = require('../activityRepository');
const { isValidISODate } = require('../../auxiliary-functions');

module.exports = async (groupId, date, userId) => {
    if (!isValidISODate(date)) {
        const error = new Error('The date is not valid. Must be YYYYY-MM-DD');
        error.status = 400;
        throw error;
    }

    return await activityRepository.findByDay(groupId, date);
};
