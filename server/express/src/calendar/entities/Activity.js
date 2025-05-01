class Activity {
    constructor({
        id = null,
        groupId,
        title,
        description = null,
        startDate,
        endDate,
        location = null,
        createdBy,
        participants = []
    }) {
        this.id = id;
        this.groupId = groupId;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.createdBy = createdBy;
        this.participants = participants;
    }
}

module.exports = Activity;