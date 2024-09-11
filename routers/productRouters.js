const express = require('express');
const productControllers = require("../controllers/productControllers");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage});

// const storage = multer.diskStorage({
//     destination: (req, res, cb) => {
//         cb(null, "upload/")
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     } ``
// })

// const upload = multer({ storage: storage })

router.post('/api/product', uploads.array('images'), productControllers.createProduct);
router.get("/api/product", productControllers.getAllProduct)

module.exports = router;