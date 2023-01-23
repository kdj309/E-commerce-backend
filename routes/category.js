const { Router } = require("express");
const { check } = require("express-validator");
const { getCategoryById, Createcategory, getCategory, getAllcategory, updatecategory, deletecategory } = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isAdmin, isSignIn } = require("../middleware/UserMiddleWares");
const route = Router()
//?Parameteres
route.param("userid", getUserById)
route.param("categoryid", getCategoryById)

//?post routes
route.post('/category/user/createcategory/:userid', isSignIn, isAuthenticated, isAdmin, Createcategory)

//?get routes
route.get('/category/:categoryid', getCategory)
route.get('/categories', getAllcategory)

//?put routes
route.put('/category/:categoryid/:userid', isSignIn, isAuthenticated, isAdmin, updatecategory)

//?delete routes
route.delete('/category/:categoryid/:userid', isSignIn, isAuthenticated, isAdmin, deletecategory)
module.exports = route