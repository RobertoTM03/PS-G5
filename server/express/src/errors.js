class TripCollabError extends Error {
    constructor(message) {
        super(message);
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


class PermissionDeniedError extends TripCollabError {
    constructor() {
        const message = "Current user is not allowed to perform this operation";
        super(message);
        this.name = "PermissionDeniedError";
    }
}

module.exports = {
    TripCollabError,
    MissingRequiredFieldsError,
    throwIfMissingRequiredFields,
    PermissionDeniedError,
};