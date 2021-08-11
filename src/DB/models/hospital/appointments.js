const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  name: String,
  docName:String,
  date: String,
  complaints: String,
  userId:String,
});

module.exports = Appointment = mongoose.model("appointments", appointmentSchema);