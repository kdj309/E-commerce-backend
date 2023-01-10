var jwt = require('jsonwebtoken');
const User = require('../models/User');
var expressjwt = require("express-jwt")
require('dotenv').config()
//Our own verification middleware
exports.VerifyUser = (req, res, next) => {
    let token = req.header('authtoken')
    console.log(token)
    if (!token) {
        return res.status(401).json({ errormsg: "please authenticate yourself" })
    }
    try {
        let result = jwt.verify(token, process.env.JWTKEY)
        req.uid = result.id
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errormsg: "Some internal error occured" })
    }
}
//Actual middleware used in this project
//VerifyUser=combination of isSignIn && isAuthenticated
exports.isSignIn = expressjwt({
    secret: process.env.JWTKEY,
    userProperty: "auth"
})
//isAuthenticated middleware
exports.isAuthenticated = (req, res, next) => {
    let result = req.profile && req.auth && req.profile._id == req.auth.id
    if (!result) {
        return res.status(403).json({ errormsg: "Access denied" })
    }
    next()
}
//isAdmin middleware
exports.isAdmin = (req, res, next) => {
    //console.log(req.profile);
    if (req.profile.role == 0) {
        return res.status(403).json({ errormsg: "Admin Access denied" })
    }
    next()
}
//middleware to push purchase list
exports.pushTopurchaselist = (req, res, next) => {

    let newpurchaselist = req.body.order.products.map((product) => {
        return {
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            cost: req.body.order.amount,
            transaction_id: req.body.order.transactionId
        }
    })
    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { purchase: newpurchaselist } }, { new: true }, (err, user) => {
        if (err) {
            return res.status(500).json({ errormsg: "Unable to push in purchase list" })
        }
        next()
    })

}
