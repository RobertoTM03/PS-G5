
const {throwIfMissingRequiredFields} = require('../../errors');
const {User, Contribution} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (expenseId, data, userId) => {
    const expenseRepository = new ExpenseRepository();
    
    throwIfMissingRequiredFields(data, ["amount"]);
    
    const expense = await expenseRepository.findById(expenseId);
    const user = new User(userId);
    const contribution = new Contribution(user, data.amount);
    
    expense.addContribution(contribution);
    const updatedExpense = await expenseRepository.update(expense);
    return updatedExpense;
};