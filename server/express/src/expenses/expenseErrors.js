
const {TripCollabError} = require("../errors");

class ExpenseHasNoContributorError extends TripCollabError {
    constructor() {
        const message = 'Could not perform the operation since the expense does not have a contributor yet';
        super(message);
        this.name = "ExpenseHasNoContributorError";
    }
}

class CoveredExpenseContributionError extends TripCollabError {
    constructor() {
        const message = 'Cannot add a contribution to a covered Expense.';
        super(message);
        this.name = "CoveredExpenseContributionError";
    }
}

class NegativeExpenseAmountError extends TripCollabError {
    constructor() {
        const message = 'A expense cannot have a negative amount';
        super(message);
        this.name = "NegativeAmountError";
    }
}

class ExpenseTitleTooLongError extends TripCollabError {
    constructor(max_length) {
        const message = `The expense title is too long. Title max length is ${max_length} characters`;
        super(message);
        this.name = "ExpenseTitleTooLongError";
    }
}

class ExpenseNotFoundError extends TripCollabError {
    constructor(expenseId) {
        const message = `No expense with ${expenseId} was found`;
        super(message);
        this.name = "ExpenseNotFoundError";
    }
}

module.exports = {
    ExpenseHasNoContributorError,
    CoveredExpenseContributionError,
    NegativeExpenseAmountError,
    ExpenseTitleTooLongError,
    ExpenseNotFoundError,
};