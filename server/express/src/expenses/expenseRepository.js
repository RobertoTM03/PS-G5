
const pgPromise = require("pg-promise")({
    // Context
});  
const db = require('../shared/database');
const {insert} = pgPromise.helpers;

const {Expense, User, Contribution} = require('./expenses');
const { ExpenseNotFoundError } = require("./expenseErrors");


class ExpenseRepositoryPostgreImpl {

    async getUser(userId) {
        // TODO: Crear repositorio para User para evitar tener que hacer esta consulta
        const {name} = await db.one(`
            SELECT name FROM users WHERE id = $1
            `, [userId]);
        return new User(userId, name);
    }

    async getExpenseContributions(expenseId) {
        const contributions = [];
        const contribution_rows = await db.any(`
            SELECT *
            FROM expense_contributions
            WHERE expense_id = $1
        `, [expenseId]);
        for (let i = 0; i < contribution_rows.length; i++) {
            let contributor = await this.getUser(contribution_rows[i].contributor_id);
            contributions.push(new Contribution(contributor, contribution_rows[i].amount));
        }
        return contributions;
    }

    async buildExpense(expenseData) {
        const author = await this.getUser(expenseData.author_id);
        const contributors = await this.getExpenseContributions(expenseData.id);
        return Expense.withId(
            expenseData.id, expenseData.group_id, 
            expenseData.title, expenseData.amount, 
            author, contributors,
            expenseData.tags
        );
    }

    async storeContributions(expense) {
        if (expense.contributions.length == 0) return;
        const insertColumns = ["expense_id", "contributor_id", "amount"];
        const values = [];
        for (let index = 0; index < expense.contributions.length; index++) {
            values.push(
                {
                    expense_id: expense.id, 
                    contributor_id: expense.contributions[index].contributor.id, 
                    amount: expense.contributions[index].amount
                }
            );
        }

        await db.none(insert(values, insertColumns, "expense_contributions"));
    }

    async create(expense) {
        const values = [
            expense.groupId, 
            expense.title, 
            expense.amount, 
            expense.author ? expense.author.id: null, 
            pgPromise.as.array(expense.tags),
            expense.id
        ]
        const expense_row = await db.one(`
            INSERT INTO expenses (group_id, title, amount, author_id, tags)
            VALUES ($1, $2, $3, $4, $5^)
            RETURNING *;
        `, values);
        expense.id = expense_row.id;
        await this.storeContributions(expense);
        const createdExpense = await this.buildExpense(expense_row);
        return createdExpense;        
    }

    async findById(expenseId) {
        const expense_row = await db.oneOrNone(`
            SELECT *
            FROM expenses
            WHERE id = $1
        `, [expenseId]);
        if (!expense_row) throw new ExpenseNotFoundError;
        return await this.buildExpense(expense_row);
    }
    
    async getGroupExpenses(groupId) {
        const expense_rows = await db.any(`
            SELECT * FROM expenses WHERE group_id = $1
            `, [groupId]
        );
        const expenses = [];
        for (let i = 0; i < expense_rows.length; i++) {
            let expense = await this.buildExpense(expense_rows[i]);
            expenses.push(expense);
        }
        return expenses;
    }

    async update(expense) {
        const values = [
            expense.groupId, 
            expense.title, 
            expense.amount, 
            expense.author ? expense.author.id: null, 
            pgPromise.as.array(expense.tags),
            expense.id
        ]
        const expense_row = await db.one(`
            UPDATE expenses SET 
                group_id = $1,
                title = $2,
                amount = $3,
                author_id = $4,
                tags = $5^
            WHERE id = $6
            RETURNING *
        `, values);
        await this.storeContributions(expense);
        return await this.buildExpense(expense_row);
    }

    async delete(expense) {
        await db.none(`
            DELETE FROM expenses
            WHERE id = $1
          `, [expense.id]);
    }    

}

module.exports = {
    ExpenseRepository: ExpenseRepositoryPostgreImpl
}