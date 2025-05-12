const MapLocation = require('../entities/MapLocation');
const mapRepository = require('../mapRepository');

module.exports = async (groupId, data, userId) => {
    const { title, location } = data;

    if (!title || !location) {
        const error = new Error('Missing required fields: title and location are mandatory.');
        error.status = 400;
        throw error;
    }

    if (!Array.isArray(location) || location.length !== 2) {
        const error = new Error('Location must be an array with exactly 2 numbers (latitude, longitude).');
        error.status = 400;
        throw error;
    }

    const newLocation = new MapLocation({
        groupId,
        title,
        location,
        createdBy: userId
    });

    return await mapRepository.addMapLocation(newLocation);
};
