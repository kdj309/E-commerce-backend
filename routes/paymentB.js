const { Router } = require("express");
const { getToken, processPayment } = require("../controllers/paymentB");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isSignIn } = require("../middleware/UserMiddleWares");
const router = Router()

router.param("userid", getUserById)
//! 1.getting token
router.get('/payment/getToken/:userid', isSignIn, isAuthenticated, getToken)
//! 2.process the payment
router.post('/payment/paymentprocess/Braintree/:userid', isSignIn, isAuthenticated, processPayment)
module.exports = router 