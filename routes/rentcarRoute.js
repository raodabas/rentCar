const express = require("express");
const RentCar = require("../models/rentcarModel");
const mongoose = require("mongoose");
const Car = require("../models/carModel");
const {
  rentCar,
  getrentCar,
  getAvailableCars,
} = require("../controllers/rentcarController");
const authMiddleware = require("../middleware/auth");
const route = express.Router();

route.post("/rent", rentCar);
route.get("/getrent", authMiddleware, getrentCar);
route.get("/available", getAvailableCars);

route.delete("/delete/:id", async (req, res) => {
  const rentalId = req.params.id;
  console.log("Gelen ID:", rentalId);

  if (!mongoose.Types.ObjectId.isValid(rentalId)) {
    return res.status(400).json({ error: "Geçersiz kiralama ID" });
  }

  try {
    const kiralama = await RentCar.findById(rentalId);
    if (!kiralama) {
      console.log("Kiralama bulunamadı");
      return res.status(404).json({ error: "Kiralama bulunamadı" });
    }

    console.log("Bulunan kiralama:", kiralama);

    // Sil
    await RentCar.findByIdAndDelete(rentalId);
    res.status(200).json({ message: "Kiralama başarıyla silindi" });
  } catch (err) {
    console.error("Sunucu hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = route;
