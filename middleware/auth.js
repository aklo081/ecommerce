const User = require("../models/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
         return res.json("Unathorized")
         
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await User.findById(decoded.id).select("-password");
            req.user = user;
        } catch (error) {
            console.log({ message: error.message })
        }
        
    }
}

const admin = async (req, res, next) => {
    if(req.user.role !== "admin") {
        res.josn("Access denied!")
        next();
    }
}

module.exports = { auth, admin };