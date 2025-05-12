const mapRepository = require('../mapRepository');

module.exports = async (groupId, locationId, userId) => {
    const result = await mapRepository.deleteMapLocation(groupId, locationId, userId);

    if (result.rowCount === 0) {
        const error = new Error('Location not found.');
        error.status = 404;
        throw error;
    }

    return { message: 'Location successfully deleted' };
};
