// gpsRouter.js
import express from 'express';
import Tracker from './models/Tracker.js';

const gpsRouter = express.Router();

// Endpoint to update tracker location
gpsRouter.post('/update', async (req, res) => {
    try {
        const { trackerId, latitude, longitude } = req.body;

        let tracker = await Tracker.findOne({ trackerId });

        if (tracker) {
            tracker.latitude = latitude;
            tracker.longitude = longitude;
            tracker.lastUpdated = new Date();
        } else {
            tracker = new Tracker({ trackerId, latitude, longitude, userId: req.body.userId });
        }

        await tracker.save();

        // Respond with any commands for the tracker
        const command = "LIGHT_LED"; // For demonstration, always send LIGHT_LED command
        res.status(200).json({ command });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to get tracker locations for a user
gpsRouter.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const trackers = await Tracker.find({ userId });

        res.status(200).json(trackers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint to get a specific tracker's location
gpsRouter.get('/:trackerId', async (req, res) => {
    try {
        const { trackerId } = req.params;
        const tracker = await Tracker.findOne({ trackerId });

        if (tracker) {
            res.status(200).json(tracker);
        } else {
            res.status(404).json({ error: "Tracker not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default gpsRouter;
