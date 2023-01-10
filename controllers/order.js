const Order = require("../models/Order")
//middleware for fetching order by id
exports.getOrderById = (req, res, next, id) => {
    Order.findById(id).populate('products.product', "name price").then((order) => {
        if (!order) {
            return res.status(404).json({ errormsg: "order not Found" })
        }
        req.order = order
        next()
    }).catch((error) => {
        return res.status(500).json({ errormsg: "order not Found" })
    })
}
//controller for creating a order
exports.CreateOrder = (req, res) => {
    req.body.order.user = req.profile.user
    let order = new Order(req.body.order);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({ errormsg: "failed to save order" })
        }
        res.status(200).json(order)
    })
}
//controller for fetching all Oeders
exports.getAllorders = (req, res) => {

    Order.find({}).populate("user", "_id name").then((orders) => {
        return res.status(200).json(orders)
    }).catch((err) => {
        return res.status(404).json({ errormsg: `Failed to load a orderss ${err}` })
    })
}
//getOrder status
exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("Status").enumValues)
}
exports.UpdateOrderStatus = (req, res) => {



    // Compile model from schema

    Order.update(
        { _id: req.body.orderId },
        { $set: { Status: req.body.status } }
        , (err, order) => {
            if (err) {
                return res.status(400).json({ errormsg: "failed to update order" })
            }
            res.status(200).json(order)
        })

}