const activityRepository = require('../activityRepository');
const {isGroupOwner} = require("../../groups/groupRepository");

module.exports = async (groupId, activityId, userId) => {
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

    await activityRepository.delete(activityId);
};
