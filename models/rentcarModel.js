const mongoose = require("mongoose");

const rentCarSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Rentcar", rentCarSchema);
