const db = require("../database")
const admin = require("./firebase");

exports.getUserFromToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const firebaseUid = decodedToken.uid;

        const user = await db.oneOrNone('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
        if (!user) {
            throw new UserNotFound();
        }

        return user;
    } catch (error) {
        console.error(error);
        if (error instanceof UserNotFound) {
            throw error;
        }
        throw new InvalidToken();
    }
};
