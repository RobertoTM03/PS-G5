
const {isGroupOwner} = require('../../groups/groupRepository');
const { PermissionDeniedError } = require('../../errors');

const {Contribution} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId, expenseId, data, userId) => {
    const { title, amount, contributors, tags } = data;

    console.log("title", title, "am", amount, "con", contributors, "tg", tags);

    const expenseRepository = new ExpenseRepository();
    const expense = await expenseRepository.findById(expenseId);
    const isAdmin = await isGroupOwner(groupId, userId);

    if (!isAdmin) throw new PermissionDeniedError;

    if (title)  expense.title = title;
    if (amount) expense.amount = amount;
    if (contributors) expense.contributions = Contribution.fromJSONArray(contributors);
    if (tags) expense.tags = tags;

    const updatedExpense = await expenseRepository.update(expense);
    
    return updatedExpense;
};