const express = require("express");
const Rentcar = require("../models/rentcarModel");
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

module.exports = route;
