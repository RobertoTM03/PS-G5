const mapRepository = require('../mapRepository');
const {ResourceNotFoundError} = require("../../errors");

module.exports = async (groupId) => {
    const locations = await mapRepository.getMapLocations(groupId);

    if (locations.length === 0) {
        throw new ResourceNotFoundError('Locations');
    }

    return locations;
};
