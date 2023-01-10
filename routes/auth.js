const { Router } = require("express");
const { check } = require("express-validator");
const { signup, signin, signOut } = require("../controllers/auth");
const { VerifyUser, isSignIn } = require("../middleware/UserMiddleWares");
const User = require("../models/User");
const router = Router()
//sign-Up
router.post('/signup', [check('email').isEmail().custom((user) => {
    return User.findOne({ email: user }).then((user) => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }
    })
}), check('password').isLength({
    min: 5
}).matches(/\d/).withMessage("must contain atleast one digit"),
check('firstname', "name sholud be atleast 3 charcters").isLength({
    min: 3
})], signup)

//sign-in
router.post('/signin', [check('email').isEmail(), check('password').isLength({
    min: 5
}).matches(/\d/).withMessage("please enter valid password")], signin)

//sign-out
router.get('/signout', signOut)
//Testing Authentication controller 
//Assignment
// router.get('/test', VerifyUser, (req, res) => {
//     return res.status(200).json()
// })
router.get('/test', isSignIn, (req, res) => {
    return res.send(req.auth)
})
module.exports = router