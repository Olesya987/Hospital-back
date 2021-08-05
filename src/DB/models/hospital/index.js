const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  login: String,
  email: String,
  password: String,
});

module.exports = User = mongoose.model("users", userSchema);

const appointmentSchema = new Schema({
  name: String,
  docName:String,
  date: String,
  complaints: String,
});

module.exports = Appointment = mongoose.model("appointments", appointmentSchema);