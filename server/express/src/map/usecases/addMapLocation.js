const MapLocation = require('../entities/MapLocation');
const mapRepository = require('../mapRepository');
const { MissingRequiredFieldsError, InvalidFieldFormatError } = require("../../errors");

module.exports = async (groupId, data, userId) => {
    const { title, location } = data;

    if (!title || !location) {
        throw new MissingRequiredFieldsError('title and location are mandatory');
    }

    if (!Array.isArray(location) || location.length !== 2) {
        throw new InvalidFieldFormatError('Location must be an array with exactly 2 numbers (latitude, longitude).');
    }

    const newLocation = new MapLocation({
        groupId,
        title,
        location,
        createdBy: userId
    });

    return await mapRepository.addMapLocation(newLocation);
};
