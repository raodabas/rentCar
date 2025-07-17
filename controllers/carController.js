const CarModel = require("../models/carModel");

// Araç ekle
const createCar = async (req, res) => {
  try {
    const carData = new CarModel(req.body);
    const { plate } = carData;
    console.log("Gelen veri:", req.body);
    const carExist = await CarModel.findOne({ plate });
    if (carExist) {
      return res
        .status(400)
        .json({ message: "Bu plakaya ait araç bulunmaktadır" });
    }

    const savedCar = await carData.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Tüm araçları getir
const getAllCars = async (req, res) => {
  try {
    const cars = await CarModel.find();

    if (cars.length === 0) {
      return res.status(404).json({ message: "Cars not found" });
    }

    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports = { createCar, getAllCars };
