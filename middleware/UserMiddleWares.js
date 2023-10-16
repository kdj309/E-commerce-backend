var jwt = require("jsonwebtoken");
const User = require("../models/User");
var expressjwt = require("express-jwt");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
//Our own verification middleware
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}
const VerifyUser = (req, res, next) => {
  // console.log(req)
  let token = req.header("authorization").split(" ")[1];
  // console.log(token)
  if (!token) {
    return res.status(401).json({ errormsg: "please authenticate yourself" });
  }
  try {
    let result = jwt.verify(token, process.env.JWTKEY);
    req.auth=result;
    next();
  } catch (error) {
    if (error) {
      return catchError(error, res);
    }
    // console.log(error);
    // return res.status(500).json({ errormsg: "Some internal error occured" });
  }
};

//Actual middleware used in this project
//VerifyUser=combination of isSignIn && isAuthenticated
// exports.isSignIn = expressjwt({
//   secret: process.env.JWTKEY,
//   userProperty: "auth",
//   onExpired:function(req, err){
//     console.log(req);
//     if (new Date() - err.inner.expiredAt < 5000) { return;}
//     throw err;
//   }
// });
exports.isSignIn=VerifyUser
//isAuthenticated middleware
exports.isAuthenticated = (req, res, next) => {
  // console.log(req.auth)
  let result = req.profile && req.auth && req.profile._id == req.auth.id;
  if (!result) {
    return res.status(403).json({ errormsg: "Access denied" });
  }
  next();
};
//isAdmin middleware
exports.isAdmin = (req, res, next) => {
  //console.log(req.profile);
  if (req.profile.role == 0) {
    return res.status(403).json({ errormsg: "Admin Access denied" });
  }
  next();
};
//middleware to push purchase list
exports.pushTopurchaselist = (req, res, next) => {
  // toLocaleDateString("en-IN")
  if (req.body.order.Status == "Canceled") {
    next();
  } else {
    let newpurchaselist = req.body?.order?.products?.map((product, index) => {
      return {
        _id: product.product._id,
        name: product.product.name,
        description: product.product.description,
        category: product.product.category.name,
        size: product.product.size,
        quantity: product.product.quantity,
        cost: product.product.price,
        transaction_id: req.body.order?.transactionId,
        timestamp: req.body.order?.userInfo?.address?.timestamp,
        uid: product.product.uid,
      };
    });
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { purchase: newpurchaselist[0] } },
      { new: true },
      (err, user) => {
        if (err) {
          return res
            .status(500)
            .json({ errormsg: "Unable to push in purchase list" });
        }
        next();
      }
    );
  }
};
