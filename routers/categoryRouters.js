const express = require(`express`);
const router = express.Router();
const categoryController = require("../controllers/categoryControllers")



router.post("/api/category", categoryController.createCategory);

module.exports = router;