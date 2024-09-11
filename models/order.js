const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String }, 
    address: { type: String },
    email: { type: String },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
        }
    ],
    amount: { type: Number },
    transactionId: { type: String } 
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
