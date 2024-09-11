const User = require("../models/users");
const bcrypt = require('bcryptjs');

// const { validateUser } = require("../validators");


exports.register = async (req, res) => {
    const { firstName, lastName, password, confirmPassword,email,phone,role } = req.body;



    if (!firstName || !lastName || !password || !confirmPassword || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if( password !== confirmPassword) {
        return res.json("Password do no match")
    }
     
    // if (validateUser(password)) {
    //     return res.json("Invalid user/ password")
    // }

    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.json("User already exists...")
        }

        user = new User({ firstName, lastName, password, confirmPassword, email,phone, role });
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()
        res.json(user)

    } catch (error) {
        console.log({ message: error.message })
    }

}



exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate an authentication token
        const token = user.generateAuthToken();
        res.header("auth-token", token).json({ token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Server error" });
    }
};