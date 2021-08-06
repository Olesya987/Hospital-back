const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  login: String,
  email: String,
  password: String,
});

module.exports = User = mongoose.model("users", userSchema);