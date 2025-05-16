const userRepository = require('../UserRepository');
const axios = require('axios');

module.exports = async (data) => {
    const { identifier, password } = data;

    // Basic validation
    if (!identifier || !password) {
        const error = new Error('Missing required fields: identifier and password are mandatory.');
        error.status = 400;
        throw error;
    }

    if (password.length < 8 || password.length > 32) {
        const error = new Error('Password must be between 8 and 32 characters long.');
        error.status = 422;
        throw error;
    }

    // Find the user by email or username
    const user = await userRepository.findByEmailOrName(identifier);
    if (!user) {
        const error = new Error('Invalid credentials.');
        error.status = 401;
        throw error;
    }

    try {
        // Attempt to log the user in with Firebase
        const firebaseRes = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email: user.email,
                password: password,
                returnSecureToken: true
            }
        );

        // Return the authentication token
        return firebaseRes.data.idToken;
    } catch (err) {
        console.error('Error during login:', err);
        const error = new Error('Invalid credentials.');
        error.status = 401;
        throw error;
    }
};