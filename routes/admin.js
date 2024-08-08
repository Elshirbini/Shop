const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const {check , body} = require('express-validator');


router.get('/add-product',isAuth ,adminControllers.getAddProduct);

router.post('/add-product' ,[
    body('title').isString().isLength({min : 2}).trim(),
    body('price').isFloat(),
    body('description').isLength({min : 5 , max : 400}).trim()
],isAuth,adminControllers.postAddProduct);

router.get('/products',isAuth , adminControllers.getAdminProducts);

router.get('/edit-product/:productId',isAuth , adminControllers.getEditProduct);

router.post('/edit-product',[
    body('title').isString().isLength({min : 2}).trim(),
    body('price').isFloat(),
    body('description').isLength({min : 5 , max : 400}).trim()
] ,isAuth, adminControllers.postEditProduct);

router.delete('/product/:productId' ,isAuth, adminControllers.deleteProduct);

module.exports = router

