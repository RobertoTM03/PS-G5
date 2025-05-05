
const {TripCollabError, ResourceNotFoundError} = require("../errors");

class ExpenseHasNoContributorError extends TripCollabError {
    constructor() {
        const message = 'No se pudo completar la operación. El gasto no tiene contribuciones.';
        super(message);
        this.name = "ExpenseHasNoContributorError";
    }
}

class CoveredExpenseContributionError extends TripCollabError {
    constructor() {
        const message = 'No se puede contribuir a un gasto ya cubierto.';
        super(message);
        this.name = "CoveredExpenseContributionError";
    }
}

class NegativeExpenseAmountError extends TripCollabError {
    constructor() {
        const message = 'Un gasto no puede tener una cantidad negativa';
        super(message);
        this.name = "NegativeAmountError";
    }
}

class ExpenseTitleTooLongError extends TripCollabError {
    constructor(max_length) {
        const message = `El título es demasiado largo. Máximo ${max_length} caracteres`;
        super(message);
        this.name = "ExpenseTitleTooLongError";
    }
}

class ExpenseNotFoundError extends ResourceNotFoundError {
    constructor() {
        super("Gasto");
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