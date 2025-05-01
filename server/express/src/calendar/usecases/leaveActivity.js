const activityRepository = require('../activityRepository');

module.exports = async (groupId, activityId, userId) => {
    const activity = await activityRepository.findById(groupId, activityId);
    if (!activity) {
        const error = new Error('Activity not found');
        error.status = 404;
        throw error;
    }

    const isCreator = activity.createdBy === userId;
    if (isCreator) {
        const error = new Error('The activity creator cannot leave the activity');
        error.status = 403;
        throw error;
    }

    await activityRepository.removeParticipant(activityId, userId);
};
