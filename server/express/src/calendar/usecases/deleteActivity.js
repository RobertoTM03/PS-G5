const activityRepository = require('../activityRepository');

module.exports = async (groupId, activityId, userId) => {
    const activity = await activityRepository.findById(groupId, activityId);
    if (!activity) {
        const error = new Error('Activity not found');
        error.status = 404;
        throw error;
    }

    const isCreator = activity.createdBy === userId;
    const isGroupOwner = await activityRepository.isGroupOwner(groupId, userId);

    if (!isCreator && !isGroupOwner) {
        const error = new Error('You do not have permission to modify this activity');
        error.status = 403;
        throw error;
    }

    await activityRepository.delete(activityId);
};
