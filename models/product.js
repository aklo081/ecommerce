const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ img: { type: String, required: true } }], // Use 'img' here
    description: { type: String, required: true },
    featured: { type: Boolean, default: true },
    topSelling: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
