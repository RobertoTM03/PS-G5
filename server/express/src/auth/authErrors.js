class InvalidToken extends Error {
    constructor(message) {
        message ??= 'Invalid Token';
        super(message);
        this.name = "InvalidToken";
    }
}

class UserNotFound extends Error {
    constructor(message) {
        message ??= "User not found";
        super(message);
        this.name = "InvalidToken";
    }
}

class MissingToken extends Error {
    constructor(message) {
        message ??= "Missing token";
        super(message);
        this.name = "InvalidToken";
    }
}