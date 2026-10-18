const mongoose = require("mongoose");

const UserSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: "uploads/image-1711019085615.png",
  },
  bio: {
    type: String,
  },
};

module.exports = mongoose.model("users", UserSchema);
