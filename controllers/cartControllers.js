const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("products.product")
        if (!cart) {
            cart = new Cart({ user: req.user.id, products:[] })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product Not Found!..." })
        }

        const productItems = cart.products.findIndex( items => items.product._id.toString() === productId )

        if (productItems !== -1) {
            cart.products[productItems].quantity += quantity
            cart.products[productItems].amount = product.price * cart.products[productItems].quantity
        } else {
            cart.products.push ({
                product: productId,
                quantity: quantity,
                amount: product.price * quantity
            })
        }
        const savedcart = await cart.save();
        await savedcart.populate("products.product");
        res.json(savedcart);

    } catch (error) {
        console.log({message: error.message});
    }
}

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
        if (!cart) {
            res.status(404).json({ message: "Cart does not exist" })
        }
        res.json(cart)
    } catch (error) {
        console.log({ message: error.message})
    }
}

exports.updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        // Find the cart and the product
        const cart = await Cart.findOne({ user: req.user.id });
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find and update the cart item
        const cartItem = cart.products.find(item => item.product.toString() === productId);

        if (cartItem) {
            cartItem.quantity = quantity;
            cartItem.amount = product.price * quantity;
            await cart.save();

            const updatedCart = await Cart.findOne({ user: req.user.id }).populate("products.product");
            res.json(updatedCart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error('Error updating cart:', error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteCartItem = async (req, res) => {
    const { productId } = req.body;
    try {
        // Find the cart and the product
        const cart = await Cart.findOne({ user: req.user.id });
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.save();

        const updatedCart = await Cart.findOne({ user: req.user.id }).populate("products.product");
        res.json(updatedCart);
    } catch (error) {
        console.error('Error deleting cart item:', error.message);
        res.status(500).json({ message: "Server error" });
    }
};