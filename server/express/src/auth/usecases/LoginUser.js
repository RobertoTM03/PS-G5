const userRepository = require('../UserRepository');
const {PermissionDeniedError, MissingRequiredFieldsError, InvalidFieldFormatError} = require("../../errors");

module.exports = async (data) => {
    const { identifier, password } = data;

    if (!identifier || !password) {
        throw new MissingRequiredFieldsError('identifier and password are mandatory');
    }

    if (password.length < 8 || password.length > 32) {
        throw new InvalidFieldFormatError('Invalid password: Password must be between 8 and 32 characters long.');
    }

    const user = await userRepository.findByEmailOrName(identifier);
    if (!user) {
        throw new PermissionDeniedError('Invalid credentials.');
    }

    try {
        return userRepository.getAuthToken(user, password);
    } catch (err) {
        throw new PermissionDeniedError('Invalid credentials.');
    }
};