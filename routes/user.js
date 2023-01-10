const { Router } = require("express");
const { getUserById, getUser,updateUser,getOrderList } = require("../controllers/user");
const { isAuthenticated, isSignIn } = require("../middleware/UserMiddleWares");
const route=Router()
route.param("userid",getUserById)
route.get('/user/:userid',isSignIn,isAuthenticated,getUser)
route.put('/user/:userid',isSignIn,isAuthenticated,updateUser)
route.post('/orders/user/:userid',isSignIn,isAuthenticated,getOrderList)
//assignment
// route.get('/getUsers',getAllUsers)
module.exports=route