const mapRepository = require('../mapRepository');
const { ResourceNotFoundError } = require("../../errors");

module.exports = async (groupId, locationId) => {
    const result = await mapRepository.deleteMapLocation(groupId, locationId);

    if (result.rowCount === 0) {
        throw new ResourceNotFoundError('Location');
    }

    return { message: 'Location successfully deleted' };
};
