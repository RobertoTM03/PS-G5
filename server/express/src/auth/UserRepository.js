const postgresRepo = require('./PostgresUserRepository');

module.exports = {
    findByEmail: postgresRepo.findByEmail,
    findByName: postgresRepo.findByName,
    findByEmailOrName: postgresRepo.findByEmailOrName,
    findById: postgresRepo.findById,
    save: postgresRepo.save
};
