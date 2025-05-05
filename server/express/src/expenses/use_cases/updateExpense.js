
const {isGroupOwner} = require('../../groups/groupRepository');
const { PermissionDeniedError } = require('../../errors');

const {Expense} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId, expenseId, data, userId) => {
    const { title, amount, contributor, tags } = data;

    console.log("title", title, "am", amount, "con", contributor, "tg", tags);

    const expenseRepository = new ExpenseRepository();
    const expense = await expenseRepository.findById(expenseId);
    const isAdmin = await isGroupOwner(groupId, userId);

    if (expense.author.id != userId && !isAdmin) throw new PermissionDeniedError;

    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (contributor) expense.contributor = contributor;
    if (tags) expense.tags = tags;

    const updatedExpense = await expenseRepository.update(expense);
    
    return updatedExpense;
};