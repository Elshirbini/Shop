const express = require("express");
const router = express.Router();
const shopControllers = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopControllers.getIndex);

router.get("/products", shopControllers.getProducts);

router.get("/products/:productId", shopControllers.getProduct);

router.get("/cart", isAuth, shopControllers.getCart);

router.post("/cart", isAuth, shopControllers.postCart);

router.post("/cart-delete-item", isAuth, shopControllers.deleteFromCart);

router.get('/orders/:orderId' , isAuth , shopControllers.getInvoice);

router.get('/checkout' , isAuth , shopControllers.getCheckout);

router.get('/checkout/success' , shopControllers.getCheckoutSuccess);

router.get('/checkout/cancel' , shopControllers.getCheckout);

router.get("/orders", isAuth, shopControllers.getOrders);

// router.post("/create-order", isAuth, shopControllers.postOrders);


module.exports = router;
