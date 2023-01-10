const mongoose = require("mongoose");
const { Schema, ObjectId } = require("mongoose");
const Product = require("./Product");
const User = require("./User");
const productsIncart = new Schema({


    product: {
        type: ObjectId,
        ref: Product
    },
    count: Number,
    total: Number,

})


module.exports = mongoose.model('ProductsIncart', productsIncart)


const orderSchema = new Schema({
    products: [productsIncart],
    user: {
        type: ObjectId,
        ref: User
    },
    transactionId: {
        type: String
    },
    Status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled", "Recieved", "Processing", "Shipped", "Delivered"]
    },
    userInfo: {
        address: {
            type: String,
            maxLength: 500,
            trim: true,
            require: true
        },
        phonenumber: {
            type: Number,
            require: true,
            maxLength: 10
        }
    },
    amount: Number,
    updates: Date
})


module.exports = mongoose.model('Order', orderSchema)