
const { PermissionDeniedError } = require('../../errors');

const {Expense, User} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (expenseId, userId) => {
    const expenseRepository = new ExpenseRepository();

    const expense = await expenseRepository.findById(expenseId);
    expense.removeContribution(new User(userId));

    const updatedExpense = await expenseRepository.update(expense);
    return updatedExpense;
};