const errors = require('./errors');

function errorHandler(err, req, res, next) {
    console.log("\n************************************** ERROR **************************************");
    console.log("Error:", err);
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);
    console.log("************************************** /ERROR **************************************");

    if (err instanceof errors.ResourceNotFoundError) {
        res.status(404);
    } else if (err instanceof errors.PermissionDeniedError) {
        res.status(401);
    } else if (err instanceof errors.ExpiredTokenError) {
        res.status(401);
    } else if (err instanceof errors.ConflictError) {
        res.status(409);
    } else if (err instanceof errors.TripCollabError) {
        res.status(400);
    } else {
        err.message = "Something went wrong on our side";
        res.status(500);
    }

    res.json({ error: err.message });
}

module.exports = errorHandler;
