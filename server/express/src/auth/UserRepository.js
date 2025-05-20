const actualRepo = require('./PostgresFirebaseUserRepository');

module.exports = {
    findByEmail: actualRepo.findByEmail,
    findByName: actualRepo.findByName,
    findByEmailOrName: actualRepo.findByEmailOrName,
    findById: actualRepo.findById,
    save: actualRepo.save,
    getAuthToken: actualRepo.getAuthToken,
    resetPassword: actualRepo.resetPassword
};
