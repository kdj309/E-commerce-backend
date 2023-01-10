const Order = require("../models/Order");
const User = require("../models/User");
//controllers for user specific routes
//fetching user by id middleware
exports.getUserById = (req, res, next, id) => {
    User.findById(id).select("email firstname purchase _id role").then((user) => {
        if (!user) {
            return res.status(404).json({ errormsg: "User not Found" })
        }
        req.profile = user
        next()
    }).catch((error) => {
        return res.status(404).json({ errormsg: "User not Found" })
    })
}
//fetching user
exports.getUser = (req, res) => {
    return res.json(req.profile)
}
//assignment 
// exports.getAllUsers=(req,res)=>{
//     User.find({}).then((users)=>{
//         let useremails=users.map((user)=>user.email)
//         return res.status(200).json(useremails)
//     })
// }

//updating user
exports.updateUser = (req, res) => {
    const { firstname, email, lastname } = req.body
    let newobj = {}
    if (firstname) {
        newobj.firstname = firstname
    }
    if (lastname) {
        newobj.lastname = lastname
    }
    if (email) {
        newobj.email = email
    }
    User.findByIdAndUpdate(req.profile._id, { $set: newobj }, { new: true }).select("email firstname purchase _id lastname role").then((user) => {
        if (!user) {
            return res.status(404).json({ errormsg: "User not Found" })
        }
        res.status(200).json(user)
    }).catch((error) => {
        return res.status(404).json({ errormsg: "User not Found" })
    })
}
//getting orders of particular user by using populate
exports.getOrderList = (req, res) => {
    Order.find({ user: req.profile._id }).populate("user", "_id firstname").then((user) => {
        if (!user) {
            return res.status(404).json({ errormsg: "User not Found" })
        }
        res.status(200).json(user)
    }).catch((error) => {
        return res.status(404).json({ errormsg: "User not Found" })
    })
}
