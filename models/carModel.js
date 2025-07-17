const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    plate: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
      validate: {
        validator: Number.isInteger,
      },
    },
    category: {
      type: String,
      enum: ["Hatchback", "Minivan", "Sedan", "SUV"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Otomatik", "Manuel", "Yarı Otomatik"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isAvaliable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
