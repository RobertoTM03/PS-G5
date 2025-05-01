const { getUserFromToken } = require('./authService');

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new MissingToken();
        }

        const authHeader = req.headers.authorization;
        const idToken = authHeader.split(' ')[1];
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            throw new MissingToken();
        }

        req.user = await getUserFromToken(idToken);
        next();
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};
