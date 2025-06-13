// In your route file (e.g., router.js)
import { Router } from "express";

/** import all controllers */
import * as controller from "../controllers/appController.js";
import {
  getAllUsers,
  deleteUser,
  // requestPasswordReset,
} from "../controllers/appController.js";
import { registerMail } from "../controllers/mailer.js";
import Auth, { localVariables } from "../middleware/auth.js";
import {
  linkGPSModule,
  getUserGPSModules,
  updateGPSModuleLocation,
  deleteGPSModule,
  getAllModules,
  controlEngine,
  controlPower,
  triggerAlarm,
  activateLostMode,
  restoreDefaults,
  getModuleStatus,
} from "../controllers/gpsModuleController.js";

const router = Router();

// GPS modules routes
router.post("/link", linkGPSModule);
router.get("/myDevices/user/:userId", getUserGPSModules);
router.patch("/update-location", updateGPSModuleLocation);
router.delete("/gpsModule/:id", deleteGPSModule);
router.get("/gpsModules", getAllModules);

// GPS module control routes
router.post("/module/:moduleId/engine", controlEngine);
router.post("/module/:moduleId/power", controlPower);
router.post("/module/:moduleId/alarm", triggerAlarm);
router.post("/module/:moduleId/lost-mode", activateLostMode);
router.post("/module/:moduleId/restore", restoreDefaults);
router.get("/module/:moduleId/status", getModuleStatus);

// AUTH routes
router.route("/register").post(controller.register);
router.route("/registerMail").post(registerMail);

router.route("/login").post(controller.login);

// Password Reset routes
router.route("/request-reset-password").post(controller.requestPasswordReset);
router.route("/reset-password").post(controller.resetPassword);

// Other routes remain the same
router.route("/user/:username").get(controller.getUser);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.route("/updateuser").put(Auth, controller.updateUser);

export default router;
