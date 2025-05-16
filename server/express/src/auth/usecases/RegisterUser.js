const User = require('../entities/User');
const userRepository = require('../UserRepository');
const admin = require('../../shared/firebase');
const axios = require('axios');

module.exports = async (data) => {
    const { username, email, password } = data;

    // Basic validation
    if (!username || !email || !password) {
        const error = new Error('Missing required fields: username, email, and password are mandatory.');
        error.status = 400;
        throw error;
    }

    if (!User.isValidName(username)) {
        const error = new Error('Invalid field(s) format: Name must be a non-empty string with at least 2 characters.');
        error.status = 400;
        throw error;
    }

    if (!User.isValidEmail(email)) {
        const error = new Error('Invalid field(s) format: Invalid email format.');
        error.status = 400;
        throw error;
    }

    if (password.length < 8 || password.length > 32) {
        const error = new Error('Password must be between 8 and 32 characters long.');
        error.status = 422;
        throw error;
    }

    // Check if email or username already exists
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
        const error = new Error('Email is already registered.');
        error.status = 409;
        throw error;
    }

    const existingUsername = await userRepository.findByName(username);
    if (existingUsername) {
        const error = new Error('Username is already in use.');
        error.status = 409;
        throw error;
    }

    // Create the user in Firebase
    let newUser;
    try {
        newUser = await admin.auth().createUser({
            email,
            password,
            displayName: username,
        });

        // Create user entity
        const user = new User({
            name: username,
            email: email,
            firebase_uid: newUser.uid,
        });

        // Save to the database
        await userRepository.save(user);

        // Get the authentication token for the user
        const firebaseRes = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        return firebaseRes.data.idToken;
    } catch (err) {
        console.error('Error during registration:', err);

        // Cleanup if something goes wrong after creating the user in Firebase
        if (newUser?.uid) {
            await admin.auth().deleteUser(newUser.uid);
        }

        const error = new Error('Error registering the user.');
        error.status = 500;
        throw error;
    }
};
