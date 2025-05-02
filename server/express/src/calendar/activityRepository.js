const postgresRepo = require('./postgresActivityRepository');

module.exports = {
    create: postgresRepo.create,
    findById: postgresRepo.findById,
    update: postgresRepo.update,
    delete: postgresRepo.delete,
    addParticipant: postgresRepo.addParticipant,
    removeParticipant: postgresRepo.removeParticipant,
    getParticipants: postgresRepo.getParticipants,
    findByDay: postgresRepo.findByDay,
    findByRange: postgresRepo.findByRange,
    userBelongsToGroup: postgresRepo.userBelongsToGroup,
};
