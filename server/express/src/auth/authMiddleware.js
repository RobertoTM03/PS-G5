const {AuthenticationRequiredError} = require('./authErrors');
const { getUserFromToken } = require('./authService');

exports.ensureAuthenticated = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new AuthenticationRequiredError();
        }

        const authHeader = req.headers.authorization;
        const idToken = authHeader.split(' ')[1];
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationRequiredError();
        }

        req.user = await getUserFromToken(idToken);
        next();
    } catch (err) {
        if (err instanceof AuthenticationRequiredError) {
            res.status(403);
        } else {
            res.status(401);
        }
        res.json({ message: err.message });
    }
};
