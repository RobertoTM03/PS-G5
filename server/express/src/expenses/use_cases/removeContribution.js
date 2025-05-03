
const { PermissionDeniedError } = require('../../errors');

const {Expense} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (expenseId, userId) => {
    const expenseRepository = new ExpenseRepository();

    const expense = await expenseRepository.findById(expenseId);

    if (expense.contributor && userId != expense.contributor.id) throw new PermissionDeniedError;
    expense.removeContributor();

    const updatedExpense = await expenseRepository.update(expense);
    return updatedExpense;
};