const mapRepository = require('../mapRepository');

module.exports = async (groupId) => {
    const locations = await mapRepository.getMapLocations(groupId);

    if (locations.length === 0) {
        console.log('No locations found desde useCase');
        const error = new Error('No locations found for this group.');
        error.status = 404;
        throw error;
    }

    return locations;
};
