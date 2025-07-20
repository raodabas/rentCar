const CustomerModel = require("../models/customerModel");
const { doHash } = require("../public/js/hashing");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingCustomer = await CustomerModel.findOne({ email });

    if (existingCustomer) {
      return res.status(401).json({ message: "Kullanıcı zaten var" });
    }

    const hashedPassword = await doHash(password, 12);
    const newCustomer = new CustomerModel({
      email,
      password: hashedPassword,
    });
    const result = await newCustomer.save();
    result.password = undefined;
    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (error) {
    console.error(error);
  }
};

const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ile kullanıcıyı bul
    const customer = await CustomerModel.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "E-posta bulunamadı." });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const token = jwt.sign(
      {
        customerId: customer._id,
        email: customer.email,
      },
      process.env.TOKEN_SECRET,

      { expiresIn: "2h" }
    );
    console.log("TOKEN:", token);
    res.status(200).json({
      message: "Giriş başarılı",
      token: token,
      customerId: customer._id,
      email: customer.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

module.exports = { login, signup };
