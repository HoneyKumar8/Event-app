const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    organizer: { type: String, required: true },
    location: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    registeredCount: { type: Number, default: 0 },
    category: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
