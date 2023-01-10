const { Router } = require("express");
const { check } = require("express-validator");
const { getCategoryById, Createcategory, getCategory, getAllcategory, updatecategory, deletecategory } = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isAdmin, isSignIn } = require("../middleware/UserMiddleWares");
const route = Router()
route.param("userid", getUserById)
route.param("categoryid", getCategoryById)
route.post('/category/user/createcategory/:userid', isSignIn, isAuthenticated, isAdmin, Createcategory)
route.get('/category/:categoryid', getCategory)
route.get('/categories', getAllcategory)
route.put('/category/:categoryid/:userid', isSignIn, isAuthenticated, isAdmin, updatecategory)
route.delete('/category/:categoryid/:userid', isSignIn, isAuthenticated, isAdmin, deletecategory)
module.exports = route