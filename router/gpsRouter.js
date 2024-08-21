import express from 'express';
import User from '../model/User_model.js';
import GPSModule from '../model/gps_model.js';

const router = express.Router();

// Endpoint to add a GPS module to a user
router.post('/add-tracker', async (req, res) => {
    try {
        const { userId, trackerId, latitude, longitude } = req.body;
        
       
        const gpsModule = new GPSModule({
            trackerId,
            latitude,
            longitude
        });

        await gpsModule.save();

        // Add GPS module to user
        const user = await User.findById(userId);
        user.gpsModules.push(gpsModule._id);
        await user.save();

        res.status(200).json({ message: 'GPS module added to user', gpsModule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to update GPS module location
router.post('/update-location', async (req, res) => {
    try {
        const { trackerId, latitude, longitude } = req.body;

        const gpsModule = await GPSModule.findOne({ trackerId });
        if (!gpsModule) {
            return res.status(404).json({ error: "Tracker not found" });
        }

        gpsModule.latitude = latitude;
        gpsModule.longitude = longitude;
        gpsModule.lastUpdated = new Date();

        await gpsModule.save();

        res.status(200).json({ message: 'Location updated', gpsModule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to fetch all GPS modules for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('gpsModules');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.gpsModules);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to fetch a specific GPS module's location
router.get('/tracker/:trackerId', async (req, res) => {
    try {
        const { trackerId } = req.params;

        const gpsModule = await GPSModule.findOne({ trackerId });
        if (!gpsModule) {
            return res.status(404).json({ error: "Tracker not found" });
        }

        res.status(200).json(gpsModule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to send command to light LED
router.post('/send-command', async (req, res) => {
    try {
        const { trackerId, command } = req.body;

        // Here you would implement the logic to send the command to the GPS module
        // For example, via WebSockets or another communication method

        res.status(200).json({ message: 'Command sent', command });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
