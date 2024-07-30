import mongoose from 'mongoose';

export const TrackerSchema = new mongoose.Schema({
    trackerId: {
        type: String,
        required: [true, "Please provide a unique Tracker ID"],
        unique: [true, "Tracker ID already exists"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a User ID"]
    },
    latitude: {
        type: Number,
        required: [true, "Please provide the latitude"]
    },
    longitude: {
        type: Number,
        required: [true, "Please provide the longitude"]
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Tracker', TrackerSchema);
