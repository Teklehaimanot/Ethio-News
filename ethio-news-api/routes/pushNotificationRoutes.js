const express = require("express");
const pushNotificationController = require("../controllers/pushNotificationController");
const pushNotificationRouter = express.Router();

// Route to register device token
pushNotificationRouter.post(
  "/register",
  pushNotificationController.registerToken
);
// Route to send push notification
pushNotificationRouter.post(
  "/send",
  pushNotificationController.sendPushNotification
);

module.exports = pushNotificationRouter;
