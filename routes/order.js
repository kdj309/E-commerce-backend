const { Router } = require("express");
const {
  getOrderById,
  CreateOrder,
  getAllorders,
  getOrderStatus,
  UpdateOrderStatus,
  getOrder,
  getCategoryDetails,
  deleteOrder,
  purchaseProducts,
  getUserOrders,
} = require("../controllers/order");
const {
  UpdateSoldAndstockCount,
  getproductById,
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const {
  isAuthenticated,
  isAdmin,
  isSignIn,
  pushTopurchaselist,
} = require("../middleware/UserMiddleWares");
const router = Router();
router.param("userid", getUserById);
router.param("orderid", getOrderById);
router.param("productid", getproductById);
router.post(
  "/order/create/:userid",
  isSignIn,
  isAuthenticated,
  pushTopurchaselist,
  UpdateSoldAndstockCount,
  CreateOrder
);
router.get(
  "/order/:userid/:orderid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  getOrder
);

router.get("/Orders/:userid", isSignIn, isAuthenticated, isAdmin, getAllorders);
router.get(
  "/order/status/:userid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.get(
  "/categories/:userid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  getCategoryDetails
);
router.put(
  "/order/:orderid/status/:userid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  UpdateOrderStatus
);
router.delete(
  "/Orders/:userid/:orderid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  deleteOrder
);
router.get(
  "/Orders/:userid/getUserOrders",
  isSignIn,
  isAuthenticated,
  getUserOrders
);

module.exports = router;
