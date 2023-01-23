const { Router } = require("express");
const router = Router()
const { isAuthenticated, isSignIn } = require("../middleware/UserMiddleWares");
const { getUserById } = require("../controllers/user");
const { paymentprocess } = require("../controllers/paywithStripe");

router.param('userid', getUserById)

router.post('/:userid/paymentprocess', isSignIn, isAuthenticated, paymentprocess)

module.exports = router