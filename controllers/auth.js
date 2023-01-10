const { validationResult } = require("express-validator")
var jwt = require('jsonwebtoken');
const User = require("../models/User")
require('dotenv').config()
//sign-up  controller
exports.signup = (req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    let user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(422).json({ errormsg: err.message })
        }

        return res.status(200).json({ user: { name: user.firstname, id: user._id, email: user.email } })
    })

}

//sign-in controller
exports.signin = (req, res) => {
    const { email, password } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(404).json({ errormsg: 'E-mail not exixts' });
        } else {
            if (!user.authenticate(password)) {
                return res.status(401).json({ errormsg: 'email and password does not match' })
            }
            let authtoken = jwt.sign({ id: user._id }, process.env.JWTKEY)
            res.cookie('token', authtoken, { expire: new Date() + 9999 })
            return res.status(200).json({
                user: {
                    token: authtoken,
                    id: user._id,
                    name: user.firstname,
                    role: user.role,
                    Email: user.email
                }
            })
        }
    })

    //console.log("signin controller");
}
//sign-out controller
exports.signOut = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: "Signout sucessfully" })
}
//Auhtentication middeleware using express jwt
