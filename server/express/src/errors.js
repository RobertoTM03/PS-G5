class TripCollabError extends Error {
    constructor(message) {
        super(message);
    }
}

class PermissionDeniedError extends TripCollabError {
    constructor(message) {
        super(message || "No tienes permisos para realizar esta operación");
        this.name = "PermissionDeniedError";
    }
}

class ResourceNotFoundError extends TripCollabError {
    constructor(resourceType) {
        const message = `${resourceType} no encontrado`;
        super(message);
        this.name = "ResourceNotFoundError";
    }
}


class MissingRequiredFieldsError extends TripCollabError {
    constructor(field_list) {
        const message = `Missing required fields: ${field_list}`;
        super(message);
        this.name = "MissingRequiredFieldsError";
    }
}

function throwIfMissingRequiredFields(request_data, field_list) {
    let missing_fields = [];
    for (let i = 0; i < field_list.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(request_data, field_list[i])) {
            missing_fields.push( field_list[i])
        }
    }
    if (missing_fields.length > 0) throw new MissingRequiredFieldsError(missing_fields);
}

class InvalidFieldFormatError extends TripCollabError {
    constructor(message) {
        super(message || `Invalid field(s) format}`);
        this.name = "InvalidFieldFormatError";
    }
}

class ConflictError extends TripCollabError {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
    }
}

class ExpiredTokenError extends TripCollabError {
    constructor(message) {
        super(message);
        this.name = "ExpiredTokenError";
    }
}

module.exports = {
    TripCollabError,
    PermissionDeniedError,
    ResourceNotFoundError,
    MissingRequiredFieldsError,
    throwIfMissingRequiredFields,
    InvalidFieldFormatError,
    ConflictError,
    ExpiredTokenError
};