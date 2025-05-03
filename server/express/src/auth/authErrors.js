
const {TripCollabError} = require("../errors");

class AuthError extends TripCollabError {
    constructor(message) {
        super(message);
    }
}

class InvalidToken extends AuthError {
    constructor(message) {
        message ??= 'Invalid Token';
        super(message);
        this.name = "InvalidToken";
    }
}

class UserNotFound extends AuthError {
    constructor(message) {
        message ??= "User not found";
        super(message);
        this.name = "InvalidToken";
    }
}

class AuthenticationRequiredError extends AuthError {
    constructor(message) {
        message ??= "Must be authenticated to perform this operation";
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