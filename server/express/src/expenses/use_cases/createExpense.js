
const {throwIfMissingRequiredFields} = require('../../errors');

const {Expense} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId, data, userId) => {
    const { title, amount, contributor, tags } = data;

    throwIfMissingRequiredFields(data, ["title", "amount"]);

    const newExpense = new Expense(groupId, title, amount, userId, contributor,tags);
    const expenseRepository = new ExpenseRepository();
    const createdExpense = await expenseRepository.create(newExpense);
    
    return createdExpense;
};