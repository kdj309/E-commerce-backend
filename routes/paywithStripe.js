const { Router } = require("express");
const router = Router();
const { isAuthenticated, isSignIn } = require("../middleware/UserMiddleWares");
const { getUserById } = require("../controllers/user");
const {
  paymentprocess,
  getPaymentInfo,
  cancelPayment,
} = require("../controllers/paywithStripe");

router.param("userid", getUserById);

router.post(
  "/:userid/paymentprocess",
  isSignIn,
  isAuthenticated,
  paymentprocess
);
router.get(
  "/:userid/paymentinfo/:paymentIntent",
  isSignIn,
  isAuthenticated,
  getPaymentInfo
);
router.post("/:userid/cancelpayment", isSignIn, isAuthenticated, cancelPayment);
module.exports = router;
