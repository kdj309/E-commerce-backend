const { Router } = require("express");
const {
  getUserById,
  getUser,
  updateUser,
  getOrderList,
  getAllUsers,
  deleteUser,
  updatepurchaselist,
} = require("../controllers/user");
const {
  isAuthenticated,
  isSignIn,
  isAdmin,
} = require("../middleware/UserMiddleWares");
const route = Router();
route.param("userid", getUserById);
route.get("/user/:userid", isSignIn, isAuthenticated, getUser);
route.put("/user/:userid", isSignIn, isAuthenticated, updateUser);
route.post("/orders/user/:userid", isSignIn, isAuthenticated, getOrderList);
route.get("/allusers/:userid", isSignIn, isAuthenticated, isAdmin, getAllUsers);
route.delete(
  "/user/:userid/delete/:useridtodelete",
  isSignIn,
  isAuthenticated,
  isAdmin,
  deleteUser
);
route.put(
  "/user/updatepurchaselist/:userid",
  isSignIn,
  isAuthenticated,
  updatepurchaselist
);
//assignment
// route.get('/getUsers',getAllUsers)
module.exports = route;
