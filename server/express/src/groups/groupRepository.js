const postgresRepo = require('./postgresGroupRepository');

module.exports = {
    isGroupOwner: postgresRepo.isGroupOwner,
};
