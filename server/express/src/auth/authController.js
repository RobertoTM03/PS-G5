const registerUser = require('./usecases/RegisterUser');
const loginUser = require('./usecases/LoginUser');
const resetUserPassword = require('./usecases/ResetPassword');
const getUserInfo = require('./usecases/GetUserInformation');

exports.register = async (req, res, next) => {
    try {
        const token = await registerUser(req.body);
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const token = await loginUser(req.body);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        await resetUserPassword(req.body);
        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        next(err);
    }
};

exports.getMyInformation = async (req, res, next) => {
    try {
        const userInfo = await getUserInfo(req.user);
        res.status(200).json(userInfo);
    } catch (err) {
        next(err);
    }
};