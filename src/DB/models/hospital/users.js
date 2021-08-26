const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  login: String,
  password: String,
  img: String,
});

module.exports = User = mongoose.model("users", userSchema);
