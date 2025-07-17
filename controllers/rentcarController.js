const express = require("express");
const mongoose = require("mongoose");
const Rentcar = require("../models/rentcarModel");
const Car = require("../models/carModel");
const route = express.Router();

// Kiralama işlemi
const rentCar = async (req, res) => {
  try {
    const { carId, customerId, startDate, endDate } = req.body;
    console.log("carid:", carId);
    console.log("customerid:", customerId);
    console.log("startdate:", startDate);
    console.log("enddate:", endDate);

    if (!carId || !customerId || !startDate || !endDate) {
      return res.status(400).json({ message: "Eksik bilgi gönderildi." });
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (newStart >= newEnd) {
      return res
        .status(400)
        .json({ message: "Geçerli tarih aralığı giriniz." });
    }

    const diffTime = newEnd - newStart;
    const dayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dayCount <= 0) {
      return res.status(400).json({ message: "Tarih aralığı geçersiz." });
    }

    // Aracın bu tarihlerde kiralanıp kiralanmaması kontrolü
    const existingRentcar = await Rentcar.findOne({
      carId,
      $or: [
        {
          startDate: { $lte: newEnd },
          endDate: { $gte: newStart },
        },
      ],
    });

    if (existingRentcar) {
      return res
        .status(400)
        .json({ message: "Bu tarihler arasında araç zaten kiralanmış." });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Araç bulunamadı." });
    }

    const totalPrice = car.price * dayCount;

    // Kiralama kaydı oluşturma
    const rentcar = new Rentcar({
      carId,
      customerId,
      startDate: newStart,
      endDate: newEnd,
      totalPrice,
    });

    await rentcar.save();

    res.status(201).json({
      message: "Araç başarıyla kiralandı.",
      totalDays: dayCount,
      totalPrice,
      rentcar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

const getrentCar = async (req, res) => {
  try {
    const customerId = req.customer.customerId;
    const rentals = await Rentcar.find({ customerId }).populate("carId").exec();
    console.error("galiba customerid bulunamadı");
    res.status(200).json(rentals);
  } catch (err) {
    console.error("Kiralanan araçlar alınamadı:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getAvailableCars = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Başlangıç ve bitiş tarihi gerekli." });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "Geçerli tarih aralığı giriniz." });
    }

    const rentedCars = await Rentcar.find({
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    }).select("carId");

    const rentedCarIds = rentedCars.map((r) => r.carId);

    const availableCars = await Car.find({
      _id: { $nin: rentedCarIds },
    });

    res.status(200).json(availableCars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = { rentCar, getrentCar, getAvailableCars };
