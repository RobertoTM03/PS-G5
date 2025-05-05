
const {TripCollabError, PermissionDeniedError} = require("../errors");

const createExpense = require("./use_cases/createExpense");
const getExpenses = require("./use_cases/getExpenses");
const updateExpense = require("./use_cases/updateExpense");
const deleteExpense = require("./use_cases/deleteExpense");
const addContribution = require("./use_cases/addContribution");
const removeContribution = require("./use_cases/removeContribution");


exports.createExpense = async (req, res) => {
    try {
        const result = await createExpense(req.params.groupId, req.body, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const result = await getExpenses(req.params.groupId);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const result = await updateExpense(req.params.groupId, req.params.expenseId, req.body, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const result = await deleteExpense(req.params.groupId, req.params.expenseId, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.addContribution = async (req, res) => {
    try {
        const result = await addContribution(req.params.expenseId, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.removeContribution = async (req, res) => {
    try {
        const result = await removeContribution(req.params.expenseId, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};