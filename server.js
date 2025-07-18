const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const customerRoute = require("./routes/customerRoute");
const carRoute = require("./routes/carRoute");
const rentcarRoute = require("./routes/rentcarRoute");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 7000;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then(({}) => {
    console.log("database is connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

app.use("/api/customer", customerRoute);
app.use("/api/cars", carRoute);
app.use("/api/rentcar", rentcarRoute);

app.use(express.static("public"));

