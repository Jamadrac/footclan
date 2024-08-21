// controllers/gpsModuleController.js
import User from '../model/User_model.js';
import GPSModule from '../model/gps_model.js';

// Function to link a GPS module to a user
export const linkGPSModule = async (req, res) => {
  try {
    const { userId, serialNumber } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the GPS module already exists
    let gpsModule = await GPSModule.findOne({ serialNumber });
    if (gpsModule) {
      return res.status(400).json({ error: "GPS module already linked to a user" });
    }

    // Create a new GPS module
    gpsModule = new GPSModule({
      serialNumber,
      user: userId
    });

    // Save the GPS module
    await gpsModule.save();

    // Add the GPS module to the user's gpsModules array
    user.gpsModules.push(gpsModule._id);
    await user.save();

    res.status(201).json({ message: "GPS module linked successfully", gpsModule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to view all GPS modules associated with a user
export const getUserGPSModules = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('gpsModules');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ gpsModules: user.gpsModules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateGPSModuleLocation = async (req, res) => {
    try {
      const { serialNumber, latitude, longitude } = req.body;
  
      // Find the GPS module by serial number
      const gpsModule = await GPSModule.findOne({ serialNumber });
      if (!gpsModule) {
        return res.status(404).json({ error: "GPS module not found" });
      }
  
      // Update the last known location
      gpsModule.lastKnownLocation = {
        type: 'Point',
        coordinates: [latitude, longitude]
      };
  
      // Save the updated GPS module
      await gpsModule.save();
  
      res.status(200).json({ message: "GPS module location updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };