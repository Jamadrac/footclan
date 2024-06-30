// models/GpsModule.js
const mongoose = require('mongoose');

const GpsModuleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  lastCheck: { type: String, required: true },
  latestCheck: { type: String, required: true },
  status: { type: String, enum: ['offline', 'online'], default: 'offline' },
  subscription: { type: Boolean, default: false },
});

module.exports = mongoose.model('GpsModule', GpsModuleSchema);
