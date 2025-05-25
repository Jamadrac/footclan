

// gps_model.js
import mongoose from "mongoose";

const GPSModuleSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: [true, "Please provide a unique serial number"],
    unique: [true, "Serial number already exists"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastKnownLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    default: "xox"  
  },
  model: {
    type: String,
    default: "xox"  
  },
  deviceName: {
    type: String,
    default: "xox"  
  },
  imageUrl: {
    type: String,
    default: "xox"  
  }
}, { timestamps: true });

// Add geospatial index for location queries
GPSModuleSchema.index({ lastKnownLocation: "2dsphere" });

export default mongoose.model('GPSModule', GPSModuleSchema);