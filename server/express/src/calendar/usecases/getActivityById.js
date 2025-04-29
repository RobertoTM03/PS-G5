const activityRepository = require('../activityRepository');
const Activity = require('../entities/Activity');

module.exports = async (groupId, activityId, userId) => {
    const activityData = await activityRepository.findById(groupId, activityId);

    if (!activityData) {
        const error = new Error('Activity not found');
        error.status = 404;
        throw error;
    }

    const participants = await activityRepository.getParticipants(activityId);

    return new Activity({
        ...activityData,
        participants
    });
};
