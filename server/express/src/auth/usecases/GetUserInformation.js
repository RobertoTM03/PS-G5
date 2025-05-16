const userRepository = require('../UserRepository');

module.exports = async (user) => {
    // Basic validation
    if (!user || !user.id) {
        const error = new Error('Unauthorized: user is not authenticated.');
        error.status = 401;
        throw error;
    }

    // Return only the relevant information
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        firebase_uid: user.firebase_uid
    };
};
