class MapLocation {
    constructor({
                    id = null,
                    groupId,
                    title,
                    location,
                    createdBy
                }) {
        this.id = id;
        this.groupId = groupId;
        this.title = title;
        this.location = this.validateLocation(location);
        this.createdBy = createdBy;
    }

    validateLocation(location) {
        if (!Array.isArray(location) || location.length !== 2) {
            throw new Error("Location must be an array with [latitude, longitude]");
        }

        const [lat, lng] = location;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error("Latitude and longitude must be numbers");
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            throw new Error("Latitude must be between -90 and 90, and longitude between -180 and 180");
        }

        return location;
    }
}

module.exports = MapLocation;
