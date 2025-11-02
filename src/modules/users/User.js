const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    login: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
