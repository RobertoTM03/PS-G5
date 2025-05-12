const postgresRepo = require('./postgresMapRepository');

module.exports = {
    addMapLocation: postgresRepo.addMapLocation,
    getMapLocations: postgresRepo.getMapLocations,
    findById: postgresRepo.findById,
    deleteMapLocation: postgresRepo.deleteMapLocation,
    userBelongsToGroup: postgresRepo.userBelongsToGroup,
    isGroupOwner: postgresRepo.isGroupOwner
};
