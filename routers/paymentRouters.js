const paymentController = require("../controllers/paymentControllers")
const express = require(`express`);
const router = express.Router();
const { auth } = require("../middleware/auth")



 
router.post("/api/payment/initiate",auth, paymentController.initiatepayment);
router.post("/api/payment/verify",auth, paymentController.verifyPayment);


module.exports = router;
