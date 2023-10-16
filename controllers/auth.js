const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
require("dotenv").config();
//sign-up  controller
exports.signup = (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  let user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(422).json({ errormsg: err.message });
    }

    return res.status(200).json({
      user: { name: user.firstname, id: user._id, email: user.email },
    });
  });
};

//sign-in controller
exports.signin = (req, res) => {
  const { email, password } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.status(404).json({ errormsg: "E-mail not exixts" });
    } else {
      if (!user.authenticate(password)) {
        return res
          .status(401)
          .json({ errormsg: "email and password does not match" });
      }
      // console.log(user)
      const presenttoken = await RefreshToken.findOne({ user: user._id });
      let refreshToken;
      if (presenttoken) {
        refreshToken = presenttoken.token;
      } else {
        refreshToken = await RefreshToken.generateToken(user);
      }
      let authtoken = jwt.sign({ id: user._id }, process.env.JWTKEY, {
        expiresIn: "1h",
      });
      res.cookie("token", authtoken, { expire: new Date() + 9999 });
      return res.status(200).json({
        user: {
          token: authtoken,
          id: user._id,
          fname: user.firstname,
          lname: user.lastname,
          role: user.role,
          Email: user.email,
          refreshToken: refreshToken,
        },
      });
    }
  });

  //console.log("signin controller");
};
//sign-out controller
exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signout sucessfully" });
};
//refresh token controller
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  console.log(req.body, requestToken);
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    console.log(RefreshToken.verifyExpiry(refreshToken));
    if (RefreshToken.verifyExpiry(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      process.env.JWTKEY,
      {
        expiresIn: 3600,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
