const { Router } = require("express");
const ProductsIncart=require('../models/Order')
const { getOrderById, CreateOrder,getAllorders,getOrderStatus,UpdateOrderStatus } = require("../controllers/order");
const { UpdateSoldAndstockCount, getproductById } = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isAdmin,isSignIn, pushTopurchaselist  } = require("../middleware/UserMiddleWares");
const router=Router()
router.param('userid',getUserById)
router.param('orderid',getOrderById)
router.param('productid',getproductById)
router.post('/order/create/:userid',isSignIn,isAuthenticated,pushTopurchaselist,UpdateSoldAndstockCount,CreateOrder)
router.get('/Orders/:userid',isSignIn,isAuthenticated,isAdmin,getAllorders)
router.get('/order/status/:userid',isSignIn,isAuthenticated,isAdmin,getOrderStatus)
router.put('/order/:orderid/status/:userid',isSignIn,isAuthenticated,isAdmin,UpdateOrderStatus)
module.exports=router