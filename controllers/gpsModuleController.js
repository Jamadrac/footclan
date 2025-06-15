// gpsModuleController.js
import express from "express";
import User from "../model/User_model.js";
import GPSModule from "../model/gps_model.js";

const router = express.Router();

// Link GPS Module(dont touch or update)
export const linkGPSModule = async (req, res) => {
  try {
    const { userId, serialNumber, name, model, deviceName, imageUrl } = req.body;
// console.log(req.body)
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if GPS module already exists
    let gpsModule = await GPSModule.findOne({ serialNumber });
    if (gpsModule) {
      return res.status(400).json({ error: "GPS module already linked to a user" });
    }

    // Create new GPS module
    gpsModule = new GPSModule({
      serialNumber,
      user: userId,
      name: name || "xox",
      model: model || "xox",
      deviceName: deviceName || `xox`,
      imageUrl: imageUrl || "xox",
    });

    await gpsModule.save();

    // Only try to update user if they have the gpsModules field
    if (user.gpsModules) {
      user.gpsModules.push(gpsModule._id);
      await user.save();
    }

    res.status(201).json({
      message: "GPS module linked successfully",
      gpsModule,
    });
  } catch (error) {
    console.error("Error linking GPS module:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get User's GPS Modules(dont touch or update)
export const getUserGPSModules = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find GPS modules directly by userId
    const gpsModules = await GPSModule.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: gpsModules.length,
      gpsModules, // If no modules, this will be an empty array
    });
  } catch (error) {
    console.error("Error retrieving user's GPS modules:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update GPS Module Location
export const updateGPSModuleLocation = async (req, res) => {
  try {
    const { serialNumber, latitude, longitude, speed, batteryLevel, engineStatus } = req.body;

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
      });
    }

    const gpsModule = await GPSModule.findOne({ serialNumber });
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Update location and additional information
    gpsModule.lastKnownLocation = {
      type: "Point",
      coordinates: [longitude, latitude],
      timestamp: new Date(),
      speed: speed || 0,
      batteryLevel: batteryLevel || 0,
      engineStatus: engineStatus || 'off',
      controls: {
        engineControl: gpsModule.engineControl || false,
        powerControl: gpsModule.powerControl || false,
        alarmStatus: gpsModule.alarmStatus || false,
        lostMode: gpsModule.lostMode || false
      }
    };

    await gpsModule.save();

    res.status(200).json({
      message: "GPS module location updated",
      location: gpsModule.lastKnownLocation,
      controls: {
        engineControl: gpsModule.engineControl || false,
        powerControl: gpsModule.powerControl || false,
        alarmStatus: gpsModule.alarmStatus || false,
        lostMode: gpsModule.lostMode || false
      }
    });
  } catch (error) {
    console.error("Error updating GPS module location:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete GPS Module (dont touch or update)
export const deleteGPSModule = async (req, res) => {
  try {
    const { id } = req.params;

    const gpsModule = await GPSModule.findById(id);
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Try to update user if they exist
    const user = await User.findById(gpsModule.user);
    if (user && user.gpsModules) {
      user.gpsModules = user.gpsModules.filter(
        (moduleId) => moduleId.toString() !== id
      );
      await user.save();
    }

    await GPSModule.findByIdAndDelete(id);

    res.status(200).json({
      message: "GPS module deleted successfully",
      deletedModule: gpsModule,
    });
  } catch (error) {
    console.error("Error deleting GPS module:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get All GPS Modules (dont touch or update)
export const getAllModules = async (req, res) => {
  try {
    const gpsModules = await GPSModule.find()
      .populate("user", "name email") // Populate user field with only name and email
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: gpsModules.length,
      gpsModules,
    });
    console.log(gpsModules)
  } catch (error) {
    console.error("Error retrieving all GPS modules:", error);
    res.status(500).json({ error: error.message });
  }
};


// Get Single GPS Module (dont touch or update)
export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const gpsModule = await GPSModule.findById(id).populate("user", "name email");

    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    res.status(200).json({ gpsModule });
  } catch (error) {
    console.error("Error retrieving GPS module:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update GPS Module Details (dont touch or update)
export const updateModuleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, model, deviceName, imageUrl } = req.body;

    const gpsModule = await GPSModule.findByIdAndUpdate(
      id,
      { name, model, deviceName, imageUrl },
      { new: true }
    );

    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    res.status(200).json({
      message: "GPS module updated successfully",
      gpsModule,
    });
  } catch (error) {
    console.error("Error updating GPS module details:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Nearby GPS Modules
export const getNearbyModules = async (req, res) => {
  try {
    const { longitude, latitude, radius = 1000 } = req.query;

    const coords = [parseFloat(longitude), parseFloat(latitude)];

    if (coords[1] < -90 || coords[1] > 90 || coords[0] < -180 || coords[0] > 180) {
      return res.status(400).json({
        error: "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
      });
    }

    const nearbyModules = await GPSModule.find({
      lastKnownLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords,
          },
          $maxDistance: parseInt(radius),
        },
      },
    });

    res.status(200).json({
      count: nearbyModules.length,
      modules: nearbyModules,
    });
  } catch (error) {
    console.error("Error finding nearby modules:", error);
    res.status(500).json({ error: error.message });
  }
};

// Control engine state
export const controlEngine = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { state } = req.body;
    const { userId } = req.body;  // User ID from the authenticated session

    const gpsModule = await GPSModule.findById(moduleId);
    
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Check if the module belongs to the user
    if (gpsModule.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized access to this GPS module" });
    }

    gpsModule.engineOn = state;
    gpsModule.lastUpdated = new Date();
    await gpsModule.save();

    res.json({ success: true, gpsModule });
  } catch (error) {
    console.error("Error controlling engine:", error);
    res.status(500).json({ error: error.message });
  }
};

// Control power state
export const controlPower = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { state } = req.body;
    const { userId } = req.body;

    const gpsModule = await GPSModule.findById(moduleId);
    
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Check if the module belongs to the user
    if (gpsModule.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized access to this GPS module" });
    }

    gpsModule.isActive = state;
    gpsModule.lastUpdated = new Date();
    await gpsModule.save();

    res.json({ success: true, gpsModule });
  } catch (error) {
    console.error("Error controlling power:", error);
    res.status(500).json({ error: error.message });
  }
};

// Trigger alarm
export const triggerAlarm = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { userId } = req.body;

    const gpsModule = await GPSModule.findById(moduleId);
    
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Check if the module belongs to the user
    if (gpsModule.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized access to this GPS module" });
    }

    // Here you would typically integrate with real hardware
    // For now, we'll just send a success response
    gpsModule.lastUpdated = new Date();
    await gpsModule.save();

    res.json({ success: true, message: "Alarm triggered successfully" });
  } catch (error) {
    console.error("Error triggering alarm:", error);
    res.status(500).json({ error: error.message });
  }
};

// Activate lost mode
export const activateLostMode = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { userId } = req.body;

    const gpsModule = await GPSModule.findById(moduleId);
    
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Check if the module belongs to the user
    if (gpsModule.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized access to this GPS module" });
    }

    gpsModule.inLostMode = true;
    gpsModule.isActive = true;
    gpsModule.lastUpdated = new Date();
    await gpsModule.save();

    res.json({ success: true, gpsModule });
  } catch (error) {
    console.error("Error activating lost mode:", error);
    res.status(500).json({ error: error.message });
  }
};

// Restore defaults
export const restoreDefaults = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { userId } = req.body;

    const gpsModule = await GPSModule.findById(moduleId);
    
    if (!gpsModule) {
      return res.status(404).json({ error: "GPS module not found" });
    }

    // Check if the module belongs to the user
    if (gpsModule.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized access to this GPS module" });
    }

    gpsModule.engineOn = false;
    gpsModule.isActive = true;
    gpsModule.inLostMode = false;
    gpsModule.speed = 0;
    gpsModule.lastUpdated = new Date();
    await gpsModule.save();

    res.json({ success: true, gpsModule });
  } catch (error) {
    console.error("Error restoring defaults:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get module status
export const getModuleStatus = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.query.userId || req.body.userId;

    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "User ID is required" 
      });
    }

    const gpsModule = await GPSModule.findById(moduleId);
    
    if (!gpsModule) {
      return res.status(404).json({ 
        success: false, 
        error: "GPS module not found" 
      });
    }

    // Check if the module belongs to the user
    if (gpsModule.user.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: "Unauthorized access to this GPS module" 
      });
    }

    // Calculate online status based on last update time
    const lastUpdateTime = gpsModule.lastUpdated || gpsModule.updatedAt;
    const isOnline = lastUpdateTime && (new Date() - new Date(lastUpdateTime)) < 5 * 60 * 1000; // 5 minutes threshold

    // Calculate signal strength
    let signalStrength = "unknown";
    if (isOnline) {
      const lastLocation = gpsModule.lastKnownLocation;
      if (lastLocation && lastLocation.coordinates) {
        const accuracy = lastLocation.accuracy || 10;
        if (accuracy < 5) signalStrength = "excellent";
        else if (accuracy < 10) signalStrength = "good";
        else if (accuracy < 20) signalStrength = "fair";
        else signalStrength = "poor";
      }
    }

    // Ensure we're sending all required status fields
    const status = {
      isOnline,
      engineOn: gpsModule.engineStatus === 'on',
      isActive: gpsModule.powerControl || false,
      alarmActive: gpsModule.alarmControl || false,
      lostModeActive: gpsModule.lostModeControl || false,
      batteryLevel: gpsModule.lastKnownLocation?.batteryLevel || "unknown",
      speed: gpsModule.lastKnownLocation?.speed || 0,
      altitude: gpsModule.lastKnownLocation?.altitude || 0,
      signalStrength,
      lastUpdated: lastUpdateTime,
      errorState: gpsModule.errorState || null,
      moduleId: gpsModule._id, // Include the module ID for verification
      timestamp: new Date().toISOString() // Include current timestamp
    };

    // Send the response with explicit success flag
    return res.status(200).json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error getting module status:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
};

// // Router Configuration
// router.post("/link", linkGPSModule);
// router.get("/user/:userId", getUserGPSModules);
// router.patch("/update-location", updateGPSModuleLocation);
// router.delete("/:id", deleteGPSModule);
// router.get("/", getAllModules);
// router.get("/:id", getModuleById);
// router.patch("/:id", updateModuleDetails);
// router.get("/nearby", getNearbyModules);

// export default router;