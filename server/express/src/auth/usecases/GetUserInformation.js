module.exports = async (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        firebase_uid: user.firebase_uid
    };
};
