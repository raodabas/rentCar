const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "email en az 5 karakter içermeli"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: true,
    },
  },
  { timestamps: true }
);

const CustomerModel = mongoose.model("customers", customerSchema);

module.exports = CustomerModel;
