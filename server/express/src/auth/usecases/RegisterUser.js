const User = require('../entities/User');
const userRepository = require('../UserRepository');
const {MissingRequiredFieldsError, InvalidFieldFormatError, ConflictError} = require("../../errors");

module.exports = async (data) => {
    const { username, email, password } = data;

    if (!username || !email || !password) {
        throw new MissingRequiredFieldsError('username, email and password are mandatory');
    }

    if (!User.isValidName(username)) {
        throw new InvalidFieldFormatError('Invalid field(s) format: Name must be a non-empty string with at least 2 characters.');
    }

    if (!User.isValidEmail(email)) {
        throw new InvalidFieldFormatError('Invalid field(s) format: Invalid email format.');
    }

    if (password.length < 8 || password.length > 32) {
        throw new InvalidFieldFormatError('Invalid password: Password must be between 8 and 32 characters long.');
    }

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
        throw new ConflictError('Email is already registered.');
    }

    const existingUsername = await userRepository.findByName(username);
    if (existingUsername) {
        throw new ConflictError('Username is already in use.');
    }

    const user = await userRepository.save(username, email, password);
    return await userRepository.getAuthToken(user, password);
};
