const express = require("express");
const userController = require("../controllers/userController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const User = require("../models/User");

const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/googleSignIn", userController.googleSignIn);
userRouter.get(
  "/",
  authMiddleware,
  // roleMiddleware("admin"),
  paginationMiddleware(User, "name"),
  userController.getAll
);
userRouter.get("/:userId", userController.getUserById);
userRouter.delete(
  "/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUser
);
userRouter.get("/logout/:userId", userController.logoutUser);
userRouter.patch(
  "/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  userController.updateUser
);
userRouter.get("/search/:name", userController.searchUserByName);

userRouter.post("/deleteMyData", userController.deleteUserData);

module.exports = userRouter;
