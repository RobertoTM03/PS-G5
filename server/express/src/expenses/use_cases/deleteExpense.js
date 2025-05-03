
const {isGroupOwner} = require('../../groups/groupRepository');
const { PermissionDeniedError } = require('../../errors');

const {Expense} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId, expenseId, userId) => {
    const expenseRepository = new ExpenseRepository();

    const expense = await expenseRepository.findById(expenseId);
    const isAdmin = await isGroupOwner(groupId, userId);
    if (expense.author.id != userId || !isAdmin) throw new PermissionDeniedError;

    const expenses = await expenseRepository.delete(expense);
    return expenses;
};