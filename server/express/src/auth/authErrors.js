
const {TripCollabError, ResourceNotFoundError} = require("../errors");

class AuthError extends TripCollabError {
    constructor(message) {
        super(message);
    }
}

class InvalidToken extends AuthError {
    constructor(message) {
        message ??= 'Token de sesión no válido.';
        super(message);
        this.name = "InvalidToken";
    }
}

class UserNotFound extends ResourceNotFoundError {
    constructor() {
        super("Usuario");
        this.name = "UserNotFound";
    }
}

class AuthenticationRequiredError extends AuthError {
    constructor(message) {
        message ??= "Necesita iniciar sesión para realizar esta operación.";
        super(message);
        this.name = "AuthenticationRequiredError";
    }
}

module.exports = {
    AuthError,
    InvalidToken,
    UserNotFound,
    AuthenticationRequiredError,
};