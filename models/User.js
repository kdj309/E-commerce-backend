const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
      maxLength: 15,
    },
    lastname: {
      type: String,
      maxLength: 15,
    },
    email: {
      type: String,
      unique: true,
      maxLength: 25,
      require: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    encry_password: {
      type: String,
      require: true,
    },
    purchase: {
      type: Array,
      default: [],
    },
    salt: String,
  },
  { timestamps: true }
);
//!Methods
userSchema.methods = {
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },
};
//!Virtual fields
userSchema
  .virtual("fullname")
  .get(function () {
    return `${this.firstname} ${this.lastname}`;
  })
  .set(function (v) {});
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

module.exports = mongoose.model("User", userSchema);
