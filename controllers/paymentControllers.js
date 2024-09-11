const Cart = require("../models/cart");
const Order = require("../models/order");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

dotenv.config();

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

exports.initiatepayment = async (req, res) => {
    const { user } = req;
    const { amount, currency, firstName, lastName, email, address, phone } = req.body;

    try {
        const cart = await Cart.findOne({ user: user.id });
        if (!cart || cart.products.length === 0) {
            res.json("Cart not found");
        }

        const orderId = uuidv4();
        const paymentData = {
            tx_ref: orderId,
            amount: amount,
            currency: currency,
            redirect_url: 'http://localhost:3000/api/payment/verify',
            customer: {
                email: `${user.email}`,
                name: `${firstName} ${lastName}`,
                phonenumber: phone
            },
            meta: {
                firstName,
                lastName,
                email,
                phone,
                address,
            },
            customization: {
                title: "StoresByStores Purchase",
                description: "Payment for cart Items"
            }
        };

        const response = await fetch("https://api.flutterwave.com/v3/charges?type=mobilemoneyghana", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const data = await response.json();

        if (data.status === "success") {
            res.json({ paymentLink: data.data.link, orderId });
        } else {
            res.json("Payment failed")
        }
    } catch (error) {
        console.log( {message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { transaction_id, orderId } = req.body;

    try {
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`
            }
        });

        const data = await response.json();

        if (data.status === "success") {
            const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
            if (!cart || cart.products.length === 0) {
                res.json("Cart not found")
            }

            const order = new Order({
                user: req.user.id,
                orderId,
                firstName: data.data.meta.firstName,
                lastName: data.data.meta.lastName,
                email: data.data.meta.email,
                phone: data.data.meta.phone,
                address: data.data.meta.address,
                status: "complete",
                transactionId: transaction_id,
                amount: data.data.amount,
                quantity: data.data.quantity 
            });

            const mailOption = {
                from: process.env.EMAIL_USER, //send address
                to: data.data.meta.email, //list of r
                subject: `Hello ${user.firstName}`, //subject line
                text: `Hello ${user.firstName}, you have successfully made payment for items in your cart`
            }

            await transporter.sendMail(mailOption);

            await order.save()

            await Cart.findOneAndDelete({ user: req.user.id});
            res.json({ message: "Payment Successful", order });

            await order.save();
            await Cart.findOneAndDelete({ user: req.user.id });
            res.json({ message: "Payment successful", order });
        } else {
            res.json({ message: "Payment failed"})
        }
    } catch (error) {
        console.log({ message: error.message});
    }
};
