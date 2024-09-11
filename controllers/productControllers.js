const { validateProduct } = require('../validators');
const Product = require('../models/product');
const cloudinary = require('../config/cloudinary'); 

exports.createProduct = async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }
    const images = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
        images.push({ img: result.secure_url }); // Ensure 'img' key is used
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }
    const product = new Product({
      category: req.body.category,
      name: req.body.name,
      description: req.body.description,
      images: images,
      price: req.body.price,
      topSelling: req.body.topSelling,
      featured: req.body.featured,
    });

    const newProductData = await product.save();
    res.status(201).json(newProductData); 
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
