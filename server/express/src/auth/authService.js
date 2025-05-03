
const db = require("../shared/database")
const admin = require("../shared/firebase");

const authErrors = require("./authErrors");

exports.getUserFromToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;

        const user = await db.oneOrNone('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
        if (!user) {
            throw new authErrors.UserNotFound;
        }

        return user;
    } catch (error) {
        console.error(error);
        if (error instanceof authErrors.UserNotFound) {
            throw error;
        }
        throw new authErrors.InvalidToken;
    }
};
