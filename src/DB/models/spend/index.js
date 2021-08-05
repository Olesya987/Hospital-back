const mongoose = require("mongoose");
const { Schema } = mongoose;
const costSchema = new Schema({
  where: String,
  date: String,
  howMuch: String,
});

module.exports = Outlay = mongoose.model("costs", costSchema);
