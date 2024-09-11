const mongoose = require("mongoose");
const product = require("./product") ;
const User = require("./users");


const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1, default: 1 },
            amount: { type: Number, required: true }
        }
    ]
 }, { timestamps: true} )

 
 module.exports = mongoose.model("Cart", cartSchema);
//  ktBriQnrJTfqAgyS