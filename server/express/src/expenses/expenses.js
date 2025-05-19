
const { MissingRequiredFieldsError, throwIfMissingRequiredFields } = require('../errors');
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

class Contribution {

    constructor(user, amount) {
        this.contributor = user;
        this.amount = amount;
    }

    static fromJSONArray(jsonArray) {
        const parsedArray = [];
        for (let i = 0; i < jsonArray.length; i++) {
            parsedArray.push(Contribution.fromJSON(jsonArray[i]));    
        }
        return parsedArray;
    }

    static fromJSON(jsonData) {
        throwIfMissingRequiredFields(jsonData, ["id", "amount"]);
        const user = jsonData.hasOwnProperty("name") ? new User(jsonData.id, jsonData.name) : new User(jsonData.id);
        return new Contribution(user, jsonData.amount);
    }

    toJSON() {
        return {
            id: this.contributor.id,
            name: this.contributor.name,
            amount: this.amount
        }
    }
}

class Expense {

    static MAX_TITLE_LENGTH = 32;

    #title;
    #amount;
    #author;
    #contribution = 0;
    #contributions;
    #tags;

    constructor(groupId, title, amount, author, contributions = [], tags = []) {
        this.id = undefined;
        this.groupId = groupId;
        this.title = title;
        this.amount = amount;
        this.author = author;
        this.contributions = contributions;
        this.tags = tags;
    }

    static withId(expenseId, groupId, title, amount, author, contributions = [], tags = []) {
        const instace = new Expense(groupId, title, amount, author, contributions, tags);
        instace.id = expenseId;
        return instace;
    }

    get title() {
        return this.#title;
    }

    set title(title) {
        // TODO: Controlar tipos no soportados y lanzar Error.
        if (title === "") throw new MissingRequiredFieldsError(["title"]);
        if (title.length > Expense.MAX_TITLE_LENGTH) throw new expenseErrors.ExpenseTitleTooLongError(Expense.MAX_TITLE_LENGTH);
        this.#title = title;
    }

    get amount() {
        return this.#amount
    }

    set amount(newAmount) {
        // TODO: Controlar tipos no soportados y lanzar Error.
        if (newAmount === 0) throw new MissingRequiredFieldsError(["amount"]);
        if (newAmount < 0) throw new expenseErrors.NegativeExpenseAmountError;
        this.#amount = newAmount;
    }

    get author() {
        return this.#author;
    }

    set author(author) {
        // TODO: Controlar tipos no soportados y lanzar Error. 
        // WARNING: Actualmente puede quedar sin author de manera silenciosa
        if (author instanceof User) {
            this.#author = author;
        } else if (Number.isInteger(author)) {
            this.#author = new User(author);
        }
    }

    get contributions() {
        return this.#contributions
    }

    set contributions(contributions) {
        this.#contributions = [];
        for (let i = 0; i < contributions.length; i++) {
            this.addContribution(contributions[i])
        }
    }
    
    get contribution() {
        return this.#contribution;
    }
    
    set contribution(amount) {
        if (amount < 0) throw new expenseErrors.NegativeExpenseAmountError;
        if (amount > this.amount) throw new expenseErrors.ExcessiveContributionError;
        this.#contribution = amount;
    }
    
    addContribution(contribution) {
        // TODO: Controlar tipos no soportados y lanzar Error.
        if (this.isCovered()) throw new expenseErrors.CoveredExpenseContributionError;
        if (contribution.amount === 0) throw new MissingRequiredFieldsError(["amount"]);
        this.contribution += contribution.amount;
        this.#contributions.push(contribution);
    }

    removeContribution(user) {
        for (let i = 0; i < this.contributions; i++) {
            if (this.contributions[i].contributor.id === user.id) {
                this.contribution -= this.contributions[i].amount;
                delete this.#contributions[i];
                return;
            }
        }
        throw new expenseErrors.UserIsNotContributorError(user)
    }

    isCovered() {
        return this.contribution === this.amount;
    }

    get tags() {
        return Array.from(this.#tags);
    }

    set tags(tags) {
        // TODO: Controlar tipos no soportados y lanzar Error.
        this.#tags = new Set(tags);
    }

    toJSON() {
        console.log(this.contributions);
        return {
            id: this.id,
            title: this.title,
            amount: this.amount,
            author: this.author,
            contributors: this.contributions.map(contribution => contribution.toJSON()),
            tags: this.tags
        }
    }

}

module.exports = {
    User,
    Contribution,
    Expense,
};