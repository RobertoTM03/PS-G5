class User {
    constructor({
                    id = null,
                    name,
                    email,
                    firebase_uid
                }) {
        this.id = id;

        if (!User.isValidName(name)) {
            throw new Error("Name must be a non-empty string with at least 2 characters");
        }
        this.name = name.trim();

        if (!User.isValidEmail(email)) {
            throw new Error("Invalid email format");
        }
        this.email = email.toLowerCase();

        if (!User.isValidFirebaseUID(firebase_uid)) {
            throw new Error("Firebase UID must be a non-empty string");
        }
        this.firebase_uid = firebase_uid.trim();
    }

    static isValidName(name) {
        return typeof name === "string" && name.trim().length >= 2;
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidFirebaseUID(firebase_uid) {
        return typeof firebase_uid === "string" && firebase_uid.trim().length > 0;
    }
}

module.exports = User;
