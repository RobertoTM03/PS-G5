const activityRepository = require('../activityRepository');

module.exports = async (groupId, activityId, userId) => {
    const activity = await activityRepository.findById(groupId, activityId);
    if (!activity) {
        const error = new Error('Activity not found');
        error.status = 404;
        throw error;
    }

    await activityRepository.addParticipant(activityId, userId);
};
