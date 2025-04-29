const { getUserFromToken } = require('../services/authService');

module.exports = async (req, res, next) => {
    try {
        req.user = await getUserFromToken(req.headers.authorization);
        next();
    } catch (err) {
        res.status(err.status || 401).json({ message: err.message });
    }
};
