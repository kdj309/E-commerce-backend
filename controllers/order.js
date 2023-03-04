const Order = require("../models/Order");
//middleware for fetching order by id
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .then((order) => {
      if (!order) {
        return res.status(404).json({ errormsg: "order not Found" });
      }
      req.order = order;
      next();
    })
    .catch((error) => {
      return res.status(500).json({ errormsg: "order not Found" });
    });
};
//controller for creating a order
exports.getOrder = (req, res) => {
  return res.json(req.order);
};
exports.CreateOrder = (req, res) => {
  
  if (req.body.order.Status == "Canceled") {
    req.body.order.user = req.profile;
    let order = new Order(req.body.order);
    order.save((err, order) => {
      if (err) {
        return res
          .status(400)
          .json({ errormsg: `failed to save order ${err}` });
      }
      return res.status(200).json(order);
    });
  } else {
    req.body.order.user = req.profile;
    req.body.order.timestamp = req.body.order.userInfo.address.timestamp;
    let order = new Order(req.body.order);
    order.save((err, order) => {
      if (err) {
        return res
          .status(400)
          .json({ errormsg: `failed to save order ${err}` });
      }
      return res.status(200).json(order);
    });
  }
};
//controller for fetching all Oeders
exports.getAllorders = (req, res) => {
  Order.find({})
    .populate("user", "_id firstname lastname")
    .populate({
      path: "products.product",
      select: "name _id price description",
    })
    .then((orders) => {
      return res.status(200).json(orders);
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ errormsg: `Failed to load a orders ${err}` });
    });
};
//getOrder status
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("Status").enumValues);
};
exports.UpdateOrderStatus = (req, res) => {
  // Compile model from schema

  Order.update(
    { _id: req.body.orderId },
    { $set: { Status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({ errormsg: "failed to update order" });
      }
      res.status(200).json(order);
    }
  );
};
exports.getCategoryDetails = (req, res) => {
  Order.find({})
    .select("categories -_id")
    .then((categorie) => {
      return res.status(200).json(categorie);
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ errormsg: `Failed to load a orderedCategories ${err}` });
    });
};
exports.deleteOrder = (req, res) => {
  let order = req.order;
  order.remove((err, orderitem) => {
    if (!orderitem || err) {
      return res.status(404).json({ errormsg: "Failed to delete a order" });
    }
    return res.status(200).json(orderitem);
  });
};

exports.getUserOrders = (req, res) => {
  Order.find({ user: req.params.userid })
    .populate("user", "_id firstname lastname")
    .populate({
      path: "products.product",
      select: "name _id price description",
    })
    .then((orders) => {
      return res.status(200).json(orders);
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ errormsg: `Failed to load a user orders ${err}` });
    });
};
