
const {Expense} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (expenseId, userId) => {
    const expenseRepository = new ExpenseRepository();

    const expense = await expenseRepository.findById(expenseId);
    expense.addContributor(userId);
    const updatedExpense = await expenseRepository.update(expense);
    return updatedExpense;
};