const axios = require('axios');

module.exports = async (data) => {
    const { oobCode, newPassword } = data; //TODO cambiar nombre de la variable oobCode

    // Basic validation
    if (!oobCode || !newPassword) {
        const error = new Error('Missing required fields: oobCode and newPassword are mandatory.');
        error.status = 400;
        throw error;
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
        const error = new Error('Password must be between 8 and 32 characters long.');
        error.status = 400;
        throw error;
    }

    try {
        // Attempt to reset the password with Firebase
        await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                oobCode,
                newPassword
            }
        );
    } catch (err) {
        console.error('Error during password reset:', err);

        const firebaseError = err.response?.data?.error?.message;

        // Handle specific Firebase errors if available
        if (firebaseError === 'INVALID_OOB_CODE') {
            const error = new Error('The reset code is invalid or expired.');
            error.status = 400;
            throw error;
        }

        if (firebaseError === 'WEAK_PASSWORD') {
            const error = new Error('Password is too weak.');
            error.status = 422;
            throw error;
        }

        const error = new Error('Error resetting password.');
        error.status = 500;
        throw error;
    }
};
