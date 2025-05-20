const addMapLocation = require('./usecases/addMapLocation');
const getMapLocations = require('./usecases/getMapLocations');
const deleteMapLocation = require('./usecases/deleteMapLocation');

exports.addMapLocation = async (req, res, next) => {
    try {
        await addMapLocation(req.params.groupId, req.body, req.user.id);
        res.status(200).json({ message: 'Location successfully added to the map' });
    } catch (err) {
        next(err);
    }
};

exports.getMapLocations = async (req, res, next) => {
    try {
        const result = await getMapLocations(req.params.groupId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteMapLocation = async (req, res, next) => {
    try {
        await deleteMapLocation(req.params.groupId, req.params.locationId);
        res.status(200).json({ message: 'Location successfully deleted from the map' });
    } catch (err) {
        next(err);
    }
};
