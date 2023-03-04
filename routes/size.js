const { Router } = require("express");
const { check } = require("express-validator");
const { getUserById } = require("../controllers/user");
const {
  isAuthenticated,
  isAdmin,
  isSignIn,
} = require("../middleware/UserMiddleWares");
const {
  getSizeById,
  updatesize,
  getsize,
  getAllsizes,
  Createsize,
  deletesize,
} = require("../controllers/size");
const route = Router();
route.param("userid", getUserById);
route.param("sizeid", getSizeById);

route.post(
  "/size/user/createsize/:userid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  Createsize
);

//?get routes
route.get("/size/:sizeid", getsize);
route.get("/sizes", getAllsizes);

route.put(
  "/size/:sizeid/:userid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  updatesize
);

route.delete(
  "/size/:sizeid/:userid",
  isSignIn,
  isAuthenticated,
  isAdmin,
  deletesize
);

module.exports = route;
