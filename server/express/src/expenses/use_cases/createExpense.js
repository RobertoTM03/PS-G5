
const { PermissionDeniedError } = require('../../errors');
const {isGroupOwner} = require('../../groups/groupRepository');
const {throwIfMissingRequiredFields} = require('../../errors');

const {Expense, Contribution} = require('../expenses');
const {ExpenseRepository} = require('../expenseRepository');

module.exports = async (groupId, data, userId) => {
    const { title, amount, contributors, tags } = data;

    const isAdmin = await isGroupOwner(groupId, userId);
    if (!isAdmin) throw new PermissionDeniedError;
    throwIfMissingRequiredFields(data, ["title", "amount"]);

    const contributions = Contribution.fromJSONArray(contributors);
    const newExpense = new Expense(groupId, title, amount, userId, contributions, tags);
    const expenseRepository = new ExpenseRepository();
    const createdExpense = await expenseRepository.create(newExpense);
    
    return createdExpense;
};