const mongoose = require("mongoose");
const sizeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "L",
      enum: ["XL", "XXL", "S", "L", "XXXL", "M"],
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Size", sizeSchema);
