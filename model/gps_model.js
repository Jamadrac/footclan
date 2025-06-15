

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
  },  lastKnownLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    speed: {
      type: Number,
      default: 0
    },
    batteryLevel: {
      type: Number,
      default: 100
    },
    engineStatus: {
      type: String,
      enum: ['on', 'off'],
      default: 'off'
    }
  },
  engineControl: {
    type: Boolean,
    default: false
  },
  powerControl: {
    type: Boolean,
    default: false
  },
  alarmStatus: {
    type: Boolean,
    default: false
  },
  lostMode: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  engineOn: {
    type: Boolean,
    default: false
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
  },
  speed: {
    type: Number,
    default: 0
  },
  altitude: {
    type: Number,
    default: 0
  },
  temperature: {
    type: Number,
    default: 0
  },
  humidity: {
    type: Number,
    default: 0
  },
  inLostMode: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add geospatial index for location queries
GPSModuleSchema.index({ lastKnownLocation: "2dsphere" });

export default mongoose.model('GPSModule', GPSModuleSchema);