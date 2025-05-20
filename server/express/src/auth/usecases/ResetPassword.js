const userRepository = require("../UserRepository");
const { MissingRequiredFieldsError, InvalidFieldFormatError } = require("../../errors");

module.exports = async (data) => {
    const { resetToken, newPassword } = data;

    if (!resetToken || !newPassword) {
        throw new MissingRequiredFieldsError('obbCode and newPassword are mandatory');
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
        throw new InvalidFieldFormatError('Password must be between 8 and 32 characters long.');
    }

    await userRepository.resetPassword(resetToken, newPassword);
};
