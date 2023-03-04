const mongoose = require("mongoose");
const { Schema, ObjectId } = require("mongoose");
const Product = require("./Product");
const User = require("./User");
const Category = require("./Category");
const productsIncart = new Schema({
  product: {
    type: ObjectId,
    ref: Product,
  },
  count: Number,
  total: Number,
});
module.exports = mongoose.model("ProductsInCart", productsIncart);
const orderSchema = new Schema(
  {
    products: [productsIncart],
    user: {
      type: ObjectId,
      ref: User,
    },
    transactionId: {
      type: String,
    },
    Status: {
      type: String,
      default: "Received",
      enum: ["Canceled", "Received", "Processing", "Shipped", "Delivered"],
    },
    categories: [
      {
        type: String,
        require: true,
      },
    ],
    userInfo: {
      address: {
        city: String,
        country: String,
        streetAddress: String,
        postalCode: String,
        state: String,
      },
      phonenumber: {
        type: Number,
        require: true,
        maxLength: 10,
      },
    },
    amount: Number,
    timestamp: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
