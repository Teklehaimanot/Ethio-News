const express = require("express");
const aboutNdmcController = require("../controllers/aboutNdmcController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

aboutNdmcRouter = express.Router();

aboutNdmcRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  aboutNdmcController.createAbout
);
aboutNdmcRouter.get("/", aboutNdmcController.getAboutNdmc);
aboutNdmcRouter.delete(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  aboutNdmcController.deleteAllAboutData
);

aboutNdmcRouter.put(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  aboutNdmcController.updateAboutData
);

module.exports = aboutNdmcRouter;
