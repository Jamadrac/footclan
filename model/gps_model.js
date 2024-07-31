import mongoose from "mongoose";

const GPSModuleSchema = new mongoose.Schema({
    trackerId: {
        type: String,
        required: true,
        unique: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('GPSModule', GPSModuleSchema);
