
const {throwIfMissingRequiredFields} = require('../../errors');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (expenseId, data, userId) => {
    const expenseRepository = new ExpenseRepository();

    throwIfMissingRequiredFields(data, ["amount"]);

    const expense = await expenseRepository.findById(expenseId);
    expense.addContribution(userId, data.amount);
    const updatedExpense = await expenseRepository.update(expense);
    return updatedExpense;
};