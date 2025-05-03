const expenseErrors = require("./expenseErrors");

class User {
    constructor(userId, userName=undefined) {
        this.id = userId;
        this.name = userName;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

class Expense {

    static MAX_TITLE_LENGTH = 32;

    #title;
    #amount;
    #author;
    #contributor;
    #tags;

    constructor(groupId, title, amount, author, contributor, tags = []) {
        this.id = undefined;
        this.groupId = groupId;
        this.title = title;
        this.amount = amount;
        this.author = author;
        this.contributor = contributor;
        this.tags = tags;
    }

    static withId(expenseId, groupId, title, amount, author, contributor, tags = []) {
        const instace = new Expense(groupId, title, amount, author, contributor, tags);
        instace.id = expenseId;
        return instace;
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        if (title.length > Expense.MAX_TITLE_LENGTH) throw new expenseErrors.ExpenseTitleTooLongError(Expense.MAX_TITLE_LENGTH);
        this.#title = title;
    }

    get amount() {
        return this.#amount
    }

    set amount(newAmount) {
        if (newAmount < 0) throw new expenseErrors.NegativeExpenseAmountError;
        this.#amount = newAmount;
    }

    get author() {
        return this.#author;
    }

    set author(author) {
        if (author instanceof User) {
            this.#author = author;
        } else if (author instanceof Number) {
            this.#author = new User(author);
        }
    }

    get contributor() {
        return this.#contributor
    }

    set contributor(contributor) {
        if (contributor instanceof User) {
            this.#contributor = contributor;
        } else if (Number.isInteger(contributor)) {
            this.#contributor = new User(contributor);
        }
    }

    addContributor(userId) {
        if (this.contributor) throw new expenseErrors.CoveredExpenseContributionError;
        this.contributor = new User(userId);
    }

    removeContributor() {
        if (!this.contributor) throw new expenseErrors.ExpenseHasNoContributorError;
        this.#contributor = null;
    }

    get tags() {
        return Array.from(this.#tags);
    }

    set tags(tags) {
        this.#tags = new Set(tags);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            amount: this.amount,
            author: this.author,
            contributor: this.contributor,
            tags: this.tags
        }
    }

}

module.exports = {
    User,
    Expense,
};