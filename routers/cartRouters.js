const express = require(`express`);
const router = express.Router();
const cartController = require("../controllers/cartControllers");
const { auth } = require("../middleware/auth");



router.post("/api/add-to-cart", auth, cartController.addToCart);
router.get("/api/cart", auth, cartController.getCart);
router.put("/api/update-cart", auth, cartController.updateCart);
router.delete("/api/delete-cart", auth, cartController.deleteCartItem);


module.exports = router;
 