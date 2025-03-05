const mongoose = require("mongoose");

const plantsSchema = mongoose.Schema({
  name: String,
  description: String,
  wateringFrequency: String,
  cuisine: String,
  toxicity: String,
  seasonality: String,
  sunExposure: String,
  photo: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Plant = mongoose.model("plants", plantsSchema);

module.exports = Plant;
