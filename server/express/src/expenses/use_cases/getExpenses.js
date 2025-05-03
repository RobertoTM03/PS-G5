
const {Expense} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId) => {
    const expenseRepository = new ExpenseRepository();
    const expenses = await expenseRepository.getGroupExpenses(groupId);
    return expenses;
};