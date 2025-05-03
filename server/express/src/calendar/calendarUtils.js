exports.isValidISODate = (dateStr) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(new Date(dateStr));
};

exports.isValidISODateTime = (dateTimeStr) => {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    if (!isoRegex.test(dateTimeStr)) {
        return false;
    }

    const date = new Date(dateTimeStr);
    return !isNaN(date.getTime());
};