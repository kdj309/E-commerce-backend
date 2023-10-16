const mongoose = require("mongoose");
const Category = require("./Category");
const Size = require("./Size");

const productSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
    },
    name: {
      type: String,
      require: true,
      trim: true,
      maxLength: 32,
    },
    description: {
      type: String,
      require: true,
      maxLength: 3000,
      trim: true,
    },
    price: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
      default: 1,
    },
    Availabelstock: {
      type: Number,
    },
    soldStocks: {
      type: Number,
      default: 0,
    },
    size: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Size,
      },
    ],
    color: {
      type: String,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
