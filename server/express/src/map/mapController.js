const addMapLocation = require('./usecases/addMapLocation');
const getMapLocations = require('./usecases/getMapLocations');
const deleteMapLocation = require('./usecases/deleteMapLocation');

exports.addMapLocation = async (req, res) => {
    try {
        await addMapLocation(req.params.groupId, req.body, req.user.id);
        res.status(200).json({ message: 'Location successfully added to the map' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getMapLocations = async (req, res) => {
    try {
        const result = await getMapLocations(req.params.groupId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.deleteMapLocation = async (req, res) => {
    try {
        await deleteMapLocation(req.params.groupId, req.params.locationId, req.user.id);
        res.status(200).json({ message: 'Location successfully deleted from the map' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};
