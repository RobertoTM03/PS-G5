const db = require('../shared/database');
const User = require('./entities/User');
const axios = require('axios');
const admin = require("../shared/firebase");
const {ExpiredTokenError} = require("../errors");

module.exports = {
    async findByEmail(email) {
        try {
            const result = await db.oneOrNone(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result ? new User(result) : null;
        } catch (err) {
            console.error('Error retrieving user by email:', err);
            throw new Error('Error retrieving user by email');
        }
    },

    async findByName(name) {
        try {
            const result = await db.oneOrNone(
                'SELECT * FROM users WHERE name = $1',
                [name]
            );
            return result ? new User(result) : null;
        } catch (err) {
            console.error('Error retrieving user by name:', err);
            throw new Error('Error retrieving user by name');
        }
    },

    async findByEmailOrName(identifier) {
        try {
            const result = await db.oneOrNone(
                'SELECT * FROM users WHERE email = $1 OR name = $1',
                [identifier]
            );
            return result ? new User(result) : null;
        } catch (err) {
            console.error('Error retrieving user by email or name:', err);
            throw new Error('Error retrieving user by email or name');
        }
    },

    async findById(id) {
        try {
            const result = await db.oneOrNone(
                'SELECT * FROM users WHERE id = $1',
                [id]
            );
            return result ? new User(result) : null;
        } catch (err) {
            console.error('Error retrieving user by ID:', err);
            throw new Error('Error retrieving user by ID');
        }
    },

    async save(name, email, password) {
        let firebaseUser = null;

        try {
            firebaseUser = await admin.auth().createUser({
                email,
                password,
                displayName: name,
            });

            await db.none(
                'INSERT INTO users (name, email, firebase_uid) VALUES ($1, $2, $3)',
                [name, email, firebaseUser.uid]
            );

            const user = new User({
                name: name,
                email: email,
                firebase_uid: firebaseUser.uid,
            });

            return user;
        } catch (err) {
            console.error('Error saving the user:', err);

            if (firebaseUser && firebaseUser.uid) {
                try {
                    await admin.auth().deleteUser(firebaseUser.uid);
                } catch (firebaseErr) {
                    console.error(
                        `Error deleting user ${firebaseUser.uid} from Firebase:`,
                        firebaseErr
                    );
                }
            }

            throw new Error('Error saving the user in the database');
        }
    },

    async getAuthToken(user, password) {
        const { email } = user;

        try {
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
            console.error('Error retrieving auth token:', err);
            throw new Error('Error retrieving auth token');
        }
    },

    async resetPassword(oobCode, newPassword) {
        try {
            await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${process.env.FIREBASE_API_KEY}`,
                {
                    oobCode,
                    newPassword
                }
            );
        } catch (err){
            const firebaseError = err.response?.data?.error?.message;

            if (firebaseError === 'INVALID_OOB_CODE') {
                throw new ExpiredTokenError('The reset code is invalid or expired.');
            }

            console.error('Error resetting password:', err);
            throw new Error('Error resetting password');
        }
    }
};
