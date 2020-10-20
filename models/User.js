const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  profileType: {
    type: String,
    required: true,
    enum: ["google", "local"],
  },
  permissions: {
    type: String,
    required: true,
    default: "personal",
    enum: ["admin", "personal"],
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: function () {
      return this.profileType == "local";
    },
  },
  password: {
    type: String,
    required: function () {
      return this.profileType == "local";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
