const postgresRepo = require('./postgresGroupRepository');

module.exports = {
    isGroupOwner: postgresRepo.isGroupOwner,
    isGroupMember: postgresRepo.isGroupMember,
    throwIfMissingRequiredFields: postgresRepo.throwIfNotGroupMember,
};
