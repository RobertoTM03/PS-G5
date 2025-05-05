
const { PermissionDeniedError } = require('../../errors');
const {isGroupOwner} = require('../../groups/groupRepository');

const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId, expenseId, userId) => {
    const expenseRepository = new ExpenseRepository();

    const expense = await expenseRepository.findById(expenseId);
    const isAdmin = await isGroupOwner(groupId, userId);
    if (expense.author.id != userId && !isAdmin) throw new PermissionDeniedError;

    const expenses = await expenseRepository.delete(expense);
    return expenses;
};