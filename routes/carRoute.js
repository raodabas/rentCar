const express = require("express");
const Car = require("../models/carModel");
const { createCar, getAllCars } = require("../controllers/carController");
const Rentcar = require("../models/rentcarModel");

const route = express.Router();

route.post("/createCar", createCar);
route.get("/all", getAllCars);

route.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).send("Araç bulunamadı");
    res.json(car);
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).send("Sunucu hatası");
  }
});

route.get("/available", async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Tarih eksik" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // O tarihlerde çakışan kiralamaları bul
    const rented = await Rentcar.find({
      $or: [
        {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate },
        },
      ],
    });

    const rentedCarIds = rented.map((r) => r.carId.toString());

    // Kiralanmamış araçları getir
    const availableCars = await Car.find({
      _id: { $nin: rentedCarIds },
    });

    res.json(availableCars);
  } catch (err) {
    console.error("Uygun araçlar alınamadı", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = route;
