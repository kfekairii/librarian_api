const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserShcema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    lowercase: true,
    trim: true,
    minLength: [4, "username must be more than 3 charechters"],
    maxLength: [15, "username can not be more than 15 charechters"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "Please enter a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a passwor"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypt passwor usong bcrypt
UserShcema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT
// [ret] JWT
UserShcema.methods.getSignedJwtTokwn = function () {
  return jwt.sign({ UID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match User enterd Pasword to hashed password
// [ret] : bool
UserShcema.methods.matchPassword = async function (entredPassword) {
  return await bcrypt.compare(entredPassword, this.password);
};

module.exports = mongoose.model("User", UserShcema);
