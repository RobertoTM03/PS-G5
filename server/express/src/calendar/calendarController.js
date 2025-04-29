const createActivity = require('./usecases/createActivity');
const getActivityById = require('./usecases/getActivityById');
const updateActivity = require('./usecases/updateActivity');
const deleteActivity = require('./usecases/deleteActivity');
const joinActivity = require('./usecases/joinActivity');
const leaveActivity = require('./usecases/leaveActivity');
const removeParticipant = require('./usecases/removeParticipant');
const getActivitiesByDay = require('./usecases/getActivitiesByDay');
const getActivitiesByRange = require('./usecases/getActivitiesByRange');

exports.createActivity = async (req, res) => {
    try {
        const result = await createActivity(req.params.groupId, req.body, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getActivityById = async (req, res) => {
    try {
        const result = await getActivityById(req.params.groupId, req.params.activityId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.updateActivity = async (req, res) => {
    try {
        const result = await updateActivity(req.params.groupId, req.params.activityId, req.body, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        await deleteActivity(req.params.groupId, req.params.activityId, req.user.id);
        res.status(200).json({ message: 'Activity successfully deleted' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.joinActivity = async (req, res) => {
    try {
        await joinActivity(req.params.groupId, req.params.activityId, req.user.id);
        res.status(200).json({ message: 'User added as event participant' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.leaveActivity = async (req, res) => {
    try {
        await leaveActivity(req.params.groupId, req.params.activityId, req.user.id);
        res.status(200).json({ message: 'User successfully removed from the activity' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.removeParticipant = async (req, res) => {
    try {
        await removeParticipant(req.params.groupId, req.params.activityId, req.body.participantId, req.user.id);
        res.status(200).json({ message: 'Participant successfully eliminated' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getActivitiesByDay = async (req, res) => {
    try {
        const result = await getActivitiesByDay(req.params.groupId, req.params.date, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getActivitiesByRange = async (req, res) => {
    try {
        const result = await getActivitiesByRange(req.params.groupId, req.query.startDate, req.query.endDate, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};
