const { Router } = require("express");
const { getproductById, getProduct, createProduct, Updateprodcut, Deleteprodcut, getAllproducts, getAllUniqueCategories, imagehadler } = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isAuthenticated, isAdmin, isSignIn } = require("../middleware/UserMiddleWares");
const router = Router()
//routes

router.param("userid", getUserById)
router.param('productid', getproductById)
router.get("/product/:productid", getProduct)
router.post('/product/Create/:userid', isSignIn, isAuthenticated, isAdmin, createProduct)
router.get('/product/photo/:productid', imagehadler)
router.put('/product/updateProduct/:userid/:productid', isSignIn, isAuthenticated, isAdmin, Updateprodcut)
router.delete('/product/deleteProduct/:userid/:productid', isSignIn, isAuthenticated, isAdmin, Deleteprodcut)
router.get('/products/getAllproducts', getAllproducts)
router.get('/products/categories', getAllUniqueCategories)
module.exports = router