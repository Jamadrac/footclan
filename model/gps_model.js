// models/GPSModel.js
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
  }
}, { timestamps: true });

export default mongoose.model('GPSModule', GPSModuleSchema);