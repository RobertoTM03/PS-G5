
const {TripCollabError, ResourceNotFoundError} = require("../errors");


class ExpenseHasNoContributionsError extends TripCollabError {
    constructor() {
        const message = 'El gasto no tiene contribuciones.';
        super(message);
        this.name = "ExpenseHasNoContributionsError";
    }
}

class UserIsNotContributorError extends TripCollabError {
    constructor(user) {
        const message = `No se pudo completar la operación. El usuario ${user.name} no ha contribuido al gasto.`;
        super(message);
        this.name = "UserIsNotContributorError";
    }
}

class CoveredExpenseContributionError extends TripCollabError {
    constructor() {
        const message = 'No se puede contribuir a un gasto ya cubierto.';
        super(message);
        this.name = "CoveredExpenseContributionError";
    }
}

class ExcessiveContributionError extends TripCollabError {
    constructor() {
        const message = 'La contribución excede la cantidad del gasto.';
        super(message);
        this.name = "ExcessiveContributionError";
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
    ExpenseHasNoContributionsError,
    UserIsNotContributorError,
    CoveredExpenseContributionError,
    ExcessiveContributionError,
    NegativeExpenseAmountError,
    ExpenseTitleTooLongError,
    ExpenseNotFoundError,
};