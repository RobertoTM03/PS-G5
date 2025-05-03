
const pgPromise = require("pg-promise")({
    // Context
});  
const db = require('../shared/database');

const {Expense, User} = require('./expenses');
const {ExpenseNotFoundError} = require('./expenseErrors');


class ExpenseRepositoryPostgreImpl {

    async getUser(userId) {
        // TODO: Crear repositorio para User para evitar tener que hacer esta consulta
        const {name} = await db.one(`
            SELECT name FROM users WHERE id = $1
            `, [userId]);
        return new User(userId, name);
    }

    async getExpenseFromRow(row) {
        const author = await this.getUser(row.author_id);
        let contributor = undefined;
        if (row.contributor_id) {
            contributor = await this.getUser(row.contributor_id);
        }
        return Expense.withId(
            row.id, row.group_id, 
            row.title, row.amount, 
            author, contributor,
            row.tags
        );
    }

    async create(expense) {
        const values = [
            expense.groupId, 
            expense.title, 
            expense.amount, 
            expense.author ? expense.author.id: null, 
            expense.contributor ? expense.contributor.id: null, 
            pgPromise.as.array(expense.tags),
            expense.id
        ]
        const expense_row = await db.one(`
            INSERT INTO expenses (group_id, title, amount, author_id, contributor_id, tags)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, values);
        expense.id = expense_row.id;
        return expense;        
    }

    async findById(expenseId) {
        const expense_row = await db.oneOrNone(`
            SELECT *
            FROM expenses
            WHERE id = $1
        `, [expenseId]);
        if (!expense_row) throw new ExpenseNotFoundError;
        return await this.getExpenseFromRow(expense_row);
    }
    
    async getGroupExpenses(groupId) {
        const expense_rows = await db.any(`
            SELECT * FROM expenses WHERE group_id = $1
            `, [groupId]
        );
        const expenses = [];
        for (let i = 0; i < expense_rows.length; i++) {
            expenses.push(await this.getExpenseFromRow(expense_rows[i]));
        }
        return expenses;
    }

    async update(expense) {
        console.log(expense.toJSON());
        const values = [
            expense.groupId, 
            expense.title, 
            expense.amount, 
            expense.author ? expense.author.id: null, 
            expense.contributor ? expense.contributor.id: null, 
            pgPromise.as.array(expense.tags),
            expense.id
        ]
        const expense_row = await db.one(`
            UPDATE expenses SET 
                group_id = $1,
                title = $2,
                amount = $3,
                author_id = $4,
                contributor_id = $5,
                tags = $6^
            WHERE id = $7
            RETURNING *
        `, values);
        console.log(expense_row);
        return await this.getExpenseFromRow(expense_row);
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