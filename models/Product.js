const mongoose = require('mongoose')
const Category = require('./Category')

const productSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category
    },
    name: {
        type: String,
        require: true,
        trim: true,
        maxLength: 32,
        unique: true,
    },
    description: {
        type: String,
        require: true,
        maxLength: 3000,
        trim: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true,
        default: 1
    },
    Availabelstock: {
        type: Number,
    },
    soldStocks: {
        type: Number,
        default: 0,
    },
    size: {
        type: String,
        default: "Normal",
        enum: ["XL", "XXL", "SM", "L", "Normal"]
    },
    color: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)