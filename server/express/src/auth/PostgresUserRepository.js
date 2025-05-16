const db = require('../shared/database');
const User = require('./entities/User');

module.exports = {
    async findByEmail(email) {
        try {
            const result = await db.oneOrNone(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result ? new User(result) : null;
        } catch (err) {
            console.error('Error finding user by email:', err);
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
            console.error('Error finding user by name:', err);
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
            console.error('Error finding user by email or name:', err);
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
            console.error('Error finding user by ID:', err);
            throw new Error('Error retrieving user by ID');
        }
    },

    async save(user) {
        try {
            const { name, email, firebase_uid } = user;
            await db.none(
                'INSERT INTO users (name, email, firebase_uid) VALUES ($1, $2, $3)',
                [name, email, firebase_uid]
            );
        } catch (err) {
            console.error('Error saving user:', err);
            throw new Error('Error saving user to the database');
        }
    }
};
